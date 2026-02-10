"use server"

import { container } from "@/lib/di/container"

const { homeController } = container

export async function getBoardList() {
  try {
    return await homeController.getBoardList()
  } catch (error) {
    console.error("Error fetching board list:", error)
    return []
  }
}

export async function getLatestPosts(limit?: number) {
  try {
    return await homeController.getLatestPosts(limit)
  } catch (error) {
    console.error("Error fetching latest posts:", error)
    return []
  }
}

export async function getRecentImages(limit?: number) {
  try {
    return await homeController.getRecentImages(limit)
  } catch (error) {
    console.error("Error fetching recent images:", error)
    return []
  }
}

export async function getPostByNumber(postNumber: number) {
  try {
    return await homeController.getPostByNumber(postNumber)
  } catch (error) {
    console.error(`Error fetching post by number ${postNumber}:`, error)
    return null
  }
}
