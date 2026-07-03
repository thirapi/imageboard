"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useDefaultPassword } from "@/hooks/use-default-password";

interface ReplyState {
  author: string;
  deletionPassword: string;
  content: string;
  imageFile: File | null;
  isNsfw: boolean;
  isSpoiler: boolean;
}

interface ReplyContextType {
  state: ReplyState;
  setAuthor: React.Dispatch<React.SetStateAction<string>>;
  setDeletionPassword: React.Dispatch<React.SetStateAction<string>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  setIsNsfw: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSpoiler: React.Dispatch<React.SetStateAction<boolean>>;
  resetForm: () => void;
}

const ReplyContext = createContext<ReplyContextType | undefined>(undefined);

export function ReplyProvider({ children }: { children: React.ReactNode }) {
  const [author, setAuthorState] = useState("");
  const [deletionPassword, setDeletionPasswordState] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isNsfw, setIsNsfw] = useState(false);
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [savedPassword, setSavedPassword] = useDefaultPassword();

  // Load persistent fields from localStorage
  useEffect(() => {
    const savedAuthor = localStorage.getItem("ib-author");
    if (savedAuthor) setAuthorState(savedAuthor);
  }, []);

  // Sync auto-generated default password into form state
  useEffect(() => {
    if (savedPassword) {
      setDeletionPasswordState(savedPassword);
    }
  }, [savedPassword]);

  const setAuthor: React.Dispatch<React.SetStateAction<string>> = (val) => {
    setAuthorState((prev) => {
      const newVal = typeof val === "function" ? val(prev) : val;
      localStorage.setItem("ib-author", newVal);
      return newVal;
    });
  };

  const setDeletionPassword: React.Dispatch<React.SetStateAction<string>> = (
    val,
  ) => {
    setDeletionPasswordState((prev) => {
      const newVal = typeof val === "function" ? val(prev) : val;
      setSavedPassword(newVal);
      return newVal;
    });
  };

  const resetForm = () => {
    setContent("");
    setImageFile(null);
    setIsNsfw(false);
    setIsSpoiler(false);
  };

  return (
    <ReplyContext.Provider
      value={{
        state: {
          author,
          deletionPassword,
          content,
          imageFile,
          isNsfw,
          isSpoiler,
        },
        setAuthor,
        setDeletionPassword,
        setContent,
        setImageFile,
        setIsNsfw,
        setIsSpoiler,
        resetForm,
      }}
    >
      {children}
    </ReplyContext.Provider>
  );
}

export function useReply() {
  const context = useContext(ReplyContext);
  if (context === undefined) {
    throw new Error("useReply must be used within a ReplyProvider");
  }
  return context;
}
