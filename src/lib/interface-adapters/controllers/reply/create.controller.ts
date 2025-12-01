import { ReplyModule } from "@/lib/modules/reply.module";

const replyModule = new ReplyModule();

export const createReplyController = async (formData: FormData) => {
  const file = formData.get("image") as File;
  let fileBuffer: { buffer: Buffer; fileName: string } | undefined;
  if (file && file.size > 0) {
    const buffer = Buffer.from(await file.arrayBuffer());
    fileBuffer = { buffer, fileName: file.name };
  }

  return replyModule.createReplyUseCase.execute(
    {
      threadId: formData.get("threadId") as string,
      content: formData.get("content") as string,
      author: "Anonymous",
    },
    fileBuffer
  );
};
