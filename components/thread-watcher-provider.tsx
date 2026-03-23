"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { getThreadDetail } from "@/lib/actions/thread.actions";

export interface WatchedThread {
  id: number;
  boardCode: string;
  subject: string | null;
  snippet: string;
  lastReadReplyCount: number;
  currentReplyCount: number;
  currentImageCount: number;
  firstUnreadPostNumber: number | null;
  hasNewReplyToMe: boolean;
  isDeleted?: boolean;
  lastUpdateAt: number;
}

interface ThreadWatcherContextType {
  watchedThreads: WatchedThread[];
  myPosts: number[];
  isWatcherOpen: boolean;
  toggleWatcher: () => void;
  watchThread: (thread: { id: number; boardCode: string; subject: string | null; lastReadReplyCount: number; snippet: string }) => void;
  unwatchThread: (threadId: number) => void;
  addMyPost: (postNumber: number) => void;
  markAsRead: (threadId: number, currentCount: number) => void;
  refresh: () => Promise<void>;
}

const ThreadWatcherContext = createContext<ThreadWatcherContextType | undefined>(undefined);

export function ThreadWatcherProvider({ children }: { children: React.ReactNode }) {
  const [watchedThreads, setWatchedThreads] = useState<WatchedThread[]>([]);
  const [myPosts, setMyPosts] = useState<number[]>([]);
  const [isWatcherOpen, setIsWatcherOpen] = useState(false);
  const isFetchingRef = useRef(false);
  const pollTimerRef = useRef<NodeJS.Timeout>(undefined);


  // Load from localStorage
  useEffect(() => {
    const savedThreads = localStorage.getItem("ib-watched-threads");
    const savedMyPosts = localStorage.getItem("ib-my-posts");
    
    if (savedThreads) {
      try {
        setWatchedThreads(JSON.parse(savedThreads));
      } catch (e) {
        console.error("Failed to parse watched threads", e);
      }
    }
    
    if (savedMyPosts) {
      try {
        setMyPosts(JSON.parse(savedMyPosts));
      } catch (e) {
        console.error("Failed to parse my posts", e);
      }
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("ib-watched-threads", JSON.stringify(watchedThreads));
  }, [watchedThreads]);

  useEffect(() => {
    localStorage.setItem("ib-my-posts", JSON.stringify(myPosts));
  }, [myPosts]);

  // Sync state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "ib-watched-threads" && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue);
          setWatchedThreads(newData);
        } catch (err) {
          console.error("Failed to sync watched threads from storage event", err);
        }
      }
      if (e.key === "ib-my-posts" && e.newValue) {
        try {
          const newData = JSON.parse(e.newValue);
          setMyPosts(newData);
        } catch (err) {
          console.error("Failed to sync my posts from storage event", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleWatcher = useCallback(() => setIsWatcherOpen(prev => !prev), []);

  const watchThread = useCallback((thread: { id: number; boardCode: string; subject: string | null; lastReadReplyCount: number; snippet: string }) => {
    setWatchedThreads(prev => {
      if (prev.find(t => t.id === thread.id)) return prev;
      return [...prev, { 
        ...thread, 
        currentReplyCount: thread.lastReadReplyCount, 
        currentImageCount: 0,
        firstUnreadPostNumber: null,
        hasNewReplyToMe: false,
        lastUpdateAt: Date.now()
      }];
    });
  }, []);

  const unwatchThread = useCallback((threadId: number) => {
    setWatchedThreads(prev => prev.filter(t => t.id !== threadId));
  }, []);

  const addMyPost = useCallback((postNumber: number) => {
    setMyPosts(prev => {
      if (prev.includes(postNumber)) return prev;
      const newPosts = [...prev, postNumber];
      localStorage.setItem("ib-my-posts", JSON.stringify(newPosts));
      return newPosts;
    });
  }, []);

  const markAsRead = useCallback((threadId: number, currentCount: number) => {
    setWatchedThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return { 
          ...t, 
          lastReadReplyCount: currentCount, 
          hasNewReplyToMe: false,
          firstUnreadPostNumber: null
        };
      }
      return t;
    }));
  }, []);

  // Polling logic
  const checkThreads = useCallback(async () => {
    // Basic guard: if empty or already fetching, skip
    if (watchedThreads.length === 0 || isFetchingRef.current) return;

    isFetchingRef.current = true;
    try {
      const myPostSet = new Set(myPosts);
    const updatedThreads = await Promise.all(watchedThreads.map(async (wt) => {
      try {
        const detail = await getThreadDetail(wt.id);
        if (!detail) {
          return { ...wt, isDeleted: true };
        }

        const currentReplyCount = detail.replies.length;
        const currentImageCount = detail.replies.filter(r => !!r.image).length + (detail.thread.image ? 1 : 0);
        let hasNewReplyToMe = wt.hasNewReplyToMe;
        let firstUnreadPostNumber = wt.firstUnreadPostNumber;

        // If there are new replies since our LAST read (not poll), set the first unread if not set
        if (currentReplyCount > wt.lastReadReplyCount && !firstUnreadPostNumber) {
          // The first unread post is at index 'lastReadReplyCount'
          const firstUnread = detail.replies[wt.lastReadReplyCount];
          if (firstUnread) {
            firstUnreadPostNumber = firstUnread.postNumber;
          }
        }

        // If there are new replies since our last poll, check for mentions
        if (currentReplyCount > wt.currentReplyCount) {
          const newRepliesSincePoll = detail.replies.slice(wt.currentReplyCount);
          for (const reply of newRepliesSincePoll) {
            const mentions = reply.content.match(/>>(\d+)/g);
            if (mentions) {
              for (const mention of mentions) {
                const postNum = parseInt(mention.substring(2));
                if (myPostSet.has(postNum)) {
                  hasNewReplyToMe = true;
                  break;
                }
              }
            }
            if (hasNewReplyToMe) break;
          }
        }

        return {
          ...wt,
          currentReplyCount,
          currentImageCount,
          firstUnreadPostNumber,
          hasNewReplyToMe,
          isDeleted: false,
          lastUpdateAt: detail.replies.length > 0 
            ? new Date(detail.replies[detail.replies.length - 1].createdAt).getTime()
            : new Date(detail.thread.createdAt).getTime()
        };
      } catch (e) {
        console.error(`Failed to check thread ${wt.id}`, e);
        return wt;
      }
    }));

    // Only update state if something actually changed to avoid re-renders
    setWatchedThreads(prev => {
      const isChanged = updatedThreads.some((ut, idx) => 
        ut.currentReplyCount !== prev[idx]?.currentReplyCount || 
        ut.currentImageCount !== prev[idx]?.currentImageCount ||
        ut.firstUnreadPostNumber !== prev[idx]?.firstUnreadPostNumber ||
        ut.hasNewReplyToMe !== prev[idx]?.hasNewReplyToMe ||
        ut.isDeleted !== prev[idx]?.isDeleted ||
        ut.lastUpdateAt !== prev[idx]?.lastUpdateAt
      );
      return isChanged ? updatedThreads : prev;
    });
    } finally {
      isFetchingRef.current = false;
    }
  }, [watchedThreads, myPosts]);


  // Polling management with recursive timeout to prevent race conditions
  useEffect(() => {
    const poll = async () => {
      // Clear any existing timer just in case
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      
      await checkThreads();
      
      // Schedule next poll only AFTER current one completes
      pollTimerRef.current = setTimeout(poll, 60000);
    };

    poll();
    
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [watchedThreads.length, myPosts.length, checkThreads]); 

  return (
    <ThreadWatcherContext.Provider value={{
      watchedThreads,
      myPosts,
      isWatcherOpen,
      toggleWatcher,
      watchThread,
      unwatchThread,
      addMyPost,
      markAsRead,
      refresh: checkThreads
    }}>
      {children}
    </ThreadWatcherContext.Provider>
  );
}

export function useThreadWatcher() {
  const context = useContext(ThreadWatcherContext);
  if (context === undefined) {
    throw new Error("useThreadWatcher must be used within a ThreadWatcherProvider");
  }
  return context;
}
