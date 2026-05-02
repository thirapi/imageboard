"use server"

import { BoardRepository } from "@/lib/repositories/board.repository"
import { BoardCategoryRepository } from "@/lib/repositories/board-category.repository"
import { PostRepository } from "@/lib/repositories/post.repository"
import { cacheLife, cacheTag } from "next/cache"

// Kita instansiasi di dalam atau gunakan import murni untuk memastikan serializability
// Next.js 'use cache' sangat sensitif terhadap closure variabel non-serializable

export async function getBoardList() {
  'use cache'
  cacheLife({
    stale: 300,
    revalidate: 600,
    expire: 3600,
  })
  cacheTag('boards')
  
  // Instansiasi repository langsung di sini agar tidak menangkap variabel non-serializable dari luar
  const boardRepository = new BoardRepository()
  try {
    return await boardRepository.findAll()
  } catch (error) {
    console.error("Error fetching board list:", error)
    return []
  }
}

export async function getBoardCategories() {
  'use cache'
  cacheLife({
    stale: 600,
    revalidate: 1200,
    expire: 7200,
  })
  cacheTag('categories')
  
  const categoryRepository = new BoardCategoryRepository()
  try {
    return await categoryRepository.findAll()
  } catch (error) {
    console.error("Error fetching board categories:", error)
    return []
  }
}

export async function getLatestPosts(limit = 10, beforeDate?: Date) {
  const postRepository = new PostRepository()
  try {
    return await postRepository.getLatestPosts(limit, beforeDate)
  } catch (error) {
    console.error("Error fetching latest posts:", error)
    return []
  }
}

export async function getRecentImages(limit = 12) {
  const postRepository = new PostRepository()
  try {
    return await postRepository.getRecentImages(limit)
  } catch (error) {
    console.error("Error fetching recent images:", error)
    return []
  }
}

export async function getPostByNumber(postNumber: number) {
  const postRepository = new PostRepository()
  try {
    return await postRepository.findByPostNumber(postNumber)
  } catch (error) {
    console.error(`Error fetching post by number ${postNumber}:`, error)
    return null
  }
}

export async function getSystemStats() {
  const postRepository = new PostRepository()
  try {
    return await postRepository.getSystemStats()
  } catch (error) {
    console.error("Error fetching system stats:", error)
    return {
      totalPosts: 0,
      postsToday: 0,
      totalImages: 0,
      activeThreads24h: 0
    }
  }
}
