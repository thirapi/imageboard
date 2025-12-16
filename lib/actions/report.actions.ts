"use server"

import { container } from "@/lib/di/container"

const { reportController } = container

export async function getReports() {
  return await reportController.getReports()
}
