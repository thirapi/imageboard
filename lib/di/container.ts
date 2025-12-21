// lib/di/container.ts

// Repositories
import { BoardRepository } from "@/lib/repositories/board.repository"
import { ImageRepository } from "@/lib/repositories/image.repository"
import { PostRepository } from "@/lib/repositories/post.repository"
import { ReplyRepository } from "@/lib/repositories/reply.repository"
import { ReportRepository } from "@/lib/repositories/report.repository"
import { ThreadRepository } from "@/lib/repositories/thread.repository"

// Services
import { CloudinaryService } from "@/lib/services/cloudinary.service"
import { ContentFilterService } from "@/lib/services/content-filter.service"

// Use Cases
import { CreateReportUseCase } from "@/lib/use-cases/create-report.use-case"
import { CreateThreadUseCase } from "@/lib/use-cases/create-thread.use-case"
import { DismissReportUseCase } from "@/lib/use-cases/dismiss-report.use-case"
import { GetBoardListUseCase } from "@/lib/use-cases/get-board-list.use-case"
import { GetLatestPostsUseCase } from "@/lib/use-cases/get-latest-posts.use-case"
import { GetPendingReportsUseCase } from "@/lib/use-cases/get-pending-reports.use-case"
import { GetRecentImagesUseCase } from "@/lib/use-cases/get-recent-images.use-case"
import { GetReportsUseCase } from "@/lib/use-cases/get-reports.use-case"
import { GetThreadDetailUseCase } from "@/lib/use-cases/get-thread-detail.use-case"
import { GetThreadListUseCase } from "@/lib/use-cases/get-thread-list.use-case"
import { LockThreadUseCase } from "@/lib/use-cases/lock-thread.use-case"
import { PinThreadUseCase } from "@/lib/use-cases/pin-thread.use-case"
import { ReplyToThreadUseCase } from "@/lib/use-cases/reply-to-thread.use-case"
import { ResolveReportUseCase } from "@/lib/use-cases/resolve-report.use-case"
import { SoftDeleteReplyUseCase } from "@/lib/use-cases/soft-delete-reply.use-case"
import { SoftDeleteThreadUseCase } from "@/lib/use-cases/soft-delete-thread.use-case"
import { UnlockThreadUseCase } from "@/lib/use-cases/unlock-thread.use-case"
import { UnpinThreadUseCase } from "@/lib/use-cases/unpin-thread.use-case"

// Controllers
import { HomeController } from "@/lib/controllers/home.controller"
import { ModerationController } from "@/lib/controllers/moderation.controller"
import { ReplyController } from "@/lib/controllers/reply.controller"
import { ReportController } from "@/lib/controllers/report.controller"
import { ThreadController } from "@/lib/controllers/thread.controller"
import { SequenceService } from "../services/sequence.service"

// Instantiate Repositories
const boardRepository = new BoardRepository()
const imageRepository = new ImageRepository()
const postRepository = new PostRepository()
const replyRepository = new ReplyRepository()
const reportRepository = new ReportRepository()
const threadRepository = new ThreadRepository()

// Instantiate Services
const cloudinaryService = new CloudinaryService()
const contentFilterService = new ContentFilterService()
const sequenceService = new SequenceService()

// Instantiate Use Cases
const createReportUseCase = new CreateReportUseCase(reportRepository)
const createThreadUseCase = new CreateThreadUseCase(
  threadRepository,
  boardRepository,
  imageRepository,
  cloudinaryService,
  sequenceService
)
const dismissReportUseCase = new DismissReportUseCase(reportRepository)
const getBoardListUseCase = new GetBoardListUseCase(boardRepository)
const getLatestPostsUseCase = new GetLatestPostsUseCase(postRepository)
const getPendingReportsUseCase = new GetPendingReportsUseCase(reportRepository, threadRepository, replyRepository)
const getRecentImagesUseCase = new GetRecentImagesUseCase(postRepository)
const getReportsUseCase = new GetReportsUseCase(reportRepository)
const getThreadDetailUseCase = new GetThreadDetailUseCase(threadRepository, replyRepository)
const getThreadListUseCase = new GetThreadListUseCase(threadRepository, replyRepository)
const lockThreadUseCase = new LockThreadUseCase(threadRepository)
const pinThreadUseCase = new PinThreadUseCase(threadRepository)
const replyToThreadUseCase = new ReplyToThreadUseCase(
  replyRepository,
  threadRepository,
  imageRepository,
  cloudinaryService,
  sequenceService
)
const resolveReportUseCase = new ResolveReportUseCase(reportRepository)
const softDeleteReplyUseCase = new SoftDeleteReplyUseCase(replyRepository)
const softDeleteThreadUseCase = new SoftDeleteThreadUseCase(threadRepository)
const unlockThreadUseCase = new UnlockThreadUseCase(threadRepository)
const unpinThreadUseCase = new UnpinThreadUseCase(threadRepository)

// Instantiate Controllers
const homeController = new HomeController(getLatestPostsUseCase, getRecentImagesUseCase, getBoardListUseCase)
const moderationController = new ModerationController(
  lockThreadUseCase,
  unlockThreadUseCase,
  pinThreadUseCase,
  unpinThreadUseCase,
  softDeleteThreadUseCase,
  softDeleteReplyUseCase,
  resolveReportUseCase,
  dismissReportUseCase,
  getPendingReportsUseCase,
)
const replyController = new ReplyController(replyToThreadUseCase)
const reportController = new ReportController(reportRepository, getReportsUseCase)
const threadController = new ThreadController(createThreadUseCase, getThreadListUseCase, getThreadDetailUseCase)

// Export container
export const container = {
  homeController,
  moderationController,
  replyController,
  reportController,
  threadController,
  createReportUseCase, // Export use case directly for actions that don't use a controller
}