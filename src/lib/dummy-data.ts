import type { Board, Thread, ReplyType } from "./types"

export const boards: Board[] = [
  {
    id: "g",
    name: "/g/ - Technology",
    description: "Technology discussion and programming",
    threadCount: 156,
  },
  {
    id: "a",
    name: "/a/ - Anime & Manga",
    description: "Anime and manga discussion",
    threadCount: 89,
  },
  {
    id: "v",
    name: "/v/ - Video Games",
    description: "Video game discussion",
    threadCount: 234,
  },
  {
    id: "b",
    name: "/b/ - Random",
    description: "Random discussion",
    threadCount: 445,
  },
  {
    id: "pol",
    name: "/pol/ - Politics",
    description: "Political discussion",
    threadCount: 78,
  },
]

export const threads: Thread[] = [
  {
    id: "1",
    boardId: "g",
    title: "What programming language should I learn in 2024?",
    content:
      "I'm new to programming and want to get into web development. Should I start with JavaScript or Python? What do you anons recommend?",
    image: "/programming-code-on-screen.png",
    author: "Anonymous",
    createdAt: new Date("2024-01-15T10:30:00"),
    replyCount: 23,
    lastReply: new Date("2024-01-15T14:20:00"),
    isPinned: true,
  },
  {
    id: "2",
    boardId: "g",
    title: "Linux vs Windows for development",
    content:
      "Been using Windows for years but considering switching to Linux for development. What are your experiences?",
    author: "Anonymous",
    createdAt: new Date("2024-01-15T09:15:00"),
    replyCount: 45,
    lastReply: new Date("2024-01-15T13:45:00"),
  },
  {
    id: "3",
    boardId: "a",
    title: "Best anime of 2024 so far?",
    content: "What has been your favorite anime this year? Looking for recommendations.",
    image: "/anime-characters.jpg",
    author: "Anonymous",
    createdAt: new Date("2024-01-15T08:00:00"),
    replyCount: 67,
    lastReply: new Date("2024-01-15T12:30:00"),
  },
  {
    id: "4",
    boardId: "v",
    title: "Thoughts on the new game releases?",
    content: "So many games coming out this month. What are you anons playing?",
    author: "Anonymous",
    createdAt: new Date("2024-01-15T07:45:00"),
    replyCount: 12,
    lastReply: new Date("2024-01-15T11:15:00"),
  },
]

export const replies: ReplyType[] = [
  {
    id: "1",
    threadId: "1",
    content: "JavaScript is definitely the way to go for web dev. You can use it for both frontend and backend.",
    author: "Anonymous",
    createdAt: new Date("2024-01-15T10:45:00"),
  },
  {
    id: "2",
    threadId: "1",
    content: ">>1 This. Start with vanilla JS, then move to React or Vue.",
    author: "Anonymous",
    createdAt: new Date("2024-01-15T11:00:00"),
    replyTo: "1",
  },
  {
    id: "3",
    threadId: "1",
    content: "Python is easier to learn but JS is more versatile for web development.",
    author: "Anonymous",
    createdAt: new Date("2024-01-15T11:30:00"),
  },
  {
    id: "4",
    threadId: "1",
    content: ">>2 Agreed! Also consider TypeScript once you're comfortable with JS.",
    author: "Anonymous",
    createdAt: new Date("2024-01-15T12:00:00"),
    replyTo: "2",
  },
  {
    id: "5",
    threadId: "2",
    content: "I switched to Linux last year and never looked back. The development experience is so much better.",
    author: "Anonymous",
    createdAt: new Date("2024-01-15T09:30:00"),
  },
  {
    id: "6",
    threadId: "2",
    content: "WSL2 is a good middle ground if you're not ready to fully switch.",
    author: "Anonymous",
    createdAt: new Date("2024-01-15T10:00:00"),
  },
]
