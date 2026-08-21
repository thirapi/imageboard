import { describe, it, beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import { ReplyToThreadUseCase } from "../reply-to-thread.use-case";

function freshMocks() {
  const replyRepo = {
    create: mock.fn(() => Promise.resolve({ id: 1, postNumber: 100 })),
    countByThreadId: mock.fn(() => Promise.resolve(10)),
    findLatestByIp: mock.fn(() => Promise.resolve(null)),
  };
  const threadRepo = {
    findById: mock.fn(() =>
      Promise.resolve({ id: 123, isLocked: false, isDeleted: false, boardId: 1 }),
    ),
    updateBumpTime: mock.fn(() => Promise.resolve()),
  };
  const banRepo = { findByIp: mock.fn(() => Promise.resolve(null)) };
  const aiMod = {
    evaluateText: mock.fn(() => Promise.resolve({ isViolation: false })),
  };
  const uc = new ReplyToThreadUseCase(
    replyRepo as any,
    threadRepo as any,
    { create: mock.fn() } as any,
    { uploadImage: mock.fn() } as any,
    { getNextPostNumber: () => Promise.resolve(100) } as any,
    banRepo as any,
    { hash: () => Promise.resolve("hashed") } as any,
    aiMod as any,
    { execute: mock.fn() } as any,
  );
  return { replyRepo, threadRepo, banRepo, aiMod, uc };
}

describe("ReplyToThreadUseCase — Sage logic", () => {
  let m: ReturnType<typeof freshMocks>;

  beforeEach(() => {
    m = freshMocks();
  });

  it("does NOT bump thread when isSage = true", async () => {
    await m.uc.execute({
      threadId: 123,
      content: "test",
      isSage: true,
      ipAddress: "1.2.3.4",
    });
    assert.equal((m.threadRepo.updateBumpTime.mock.calls as any[]).length, 0);
  });

  it("bumps thread when isSage = false", async () => {
    await m.uc.execute({
      threadId: 123,
      content: "test",
      isSage: false,
      ipAddress: "1.2.3.4",
    });
    const calls = m.threadRepo.updateBumpTime.mock.calls as any[];
    assert.equal(calls.length, 1);
    assert.equal(calls[0].arguments[0], 123);
  });

  it("bumps thread when isSage is undefined (default)", async () => {
    await m.uc.execute({
      threadId: 123,
      content: "test",
      ipAddress: "1.2.3.4",
    });
    assert.equal((m.threadRepo.updateBumpTime.mock.calls as any[]).length, 1);
  });

  it("persists isSage flag on the created reply", async () => {
    await m.uc.execute({
      threadId: 123,
      content: "test",
      isSage: true,
      ipAddress: "1.2.3.4",
    });
    const calls = m.replyRepo.create.mock.calls as any[];
    const created = calls[0]?.arguments[0];
    assert.equal(created?.isSage, true);
  });
});
