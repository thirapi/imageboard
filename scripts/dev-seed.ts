import { db } from "@/db";
import * as schema from "@/db/schema";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";

// Infer the insert type for replies to use for explicit typing
type NewReply = typeof schema.replies.$inferInsert;

const BOARD_DATA = [
  { id: "g", name: "Technology", description: "Gears, gadgets, and gaming." },
  { id: "a", name: "Anime & Manga", description: "Discussions about Japanese animation and comics." },
  { id: "biz", name: "Business & Finance", description: "Stocks, crypto, and making it." },
  { id: "diy", name: "Do It Yourself", description: "Home improvement, crafts, and projects." },
  { id: "fit", name: "Fitness", description: "Health, nutrition, and exercise." },
  { id: "x", name: "Paranormal", description: "Unexplained mysteries and paranormal phenomena." },
  { id: "food", name: "Food & Cooking", description: "Recipes, restaurants, and culinary discussions." },
];

async function cleanDatabase() {
  console.log("🗑️  Clearing database tables...");
  await db.delete(schema.replies);
  await db.delete(schema.threads);
  await db.delete(schema.boards);
  console.log("✅ Database cleared.");
}

async function main() {
  console.log("🚀 Starting development database seeding...");

  await cleanDatabase();

  // --- 1. SEED BOARDS ---
  console.log("🌱 Seeding boards...");
  await db.insert(schema.boards).values(BOARD_DATA);
  console.log(`✅ ${BOARD_DATA.length} boards seeded.`);

  const allThreads = [];
  const allReplies: NewReply[] = [];

  // --- 2. GENERATE THREADS & REPLIES FOR EACH BOARD ---
  console.log("🌱 Generating threads and replies...");

  for (const board of BOARD_DATA) {
    const numThreads = faker.number.int({ min: 15, max: 40 });
    let boardThreadCount = 0;

    for (let i = 0; i < numThreads; i++) {
      boardThreadCount++;
      const threadId = faker.string.uuid();
      const createdAt = faker.date.recent({ days: 60 });
      let lastReplyTime = createdAt;

      const numReplies = faker.number.int({ min: 0, max: 120 });
      // Explicitly type the array to prevent the implicit 'any' error
      const threadReplies: NewReply[] = [];
      const replyAuthors = [faker.internet.username()];

      for (let j = 0; j < numReplies; j++) {
        const replyCreatedAt = faker.date.between({ from: lastReplyTime, to: new Date() });
        lastReplyTime = replyCreatedAt;

        if (faker.datatype.boolean({ probability: 0.2 })) {
          replyAuthors.push(faker.internet.username());
        }

        const reply: NewReply = {
          id: faker.string.uuid(),
          threadId: threadId,
          content: faker.lorem.sentences({ min: 1, max: 5 }),
          author: faker.helpers.arrayElement(replyAuthors),
          createdAt: replyCreatedAt,
          image: faker.datatype.boolean({ probability: 0.1 }) ? faker.image.urlLoremFlickr({ category: 'cats' }) : null,
          replyTo: faker.datatype.boolean({ probability: 0.15 }) && threadReplies.length > 0 ? faker.helpers.arrayElement(threadReplies).id : null,
        };
        threadReplies.push(reply);
      }

      allReplies.push(...threadReplies);

      const newThread = {
        id: threadId,
        boardId: board.id,
        title: faker.hacker.phrase().replace(/^./, (c) => c.toUpperCase()),
        content: faker.lorem.paragraphs({ min: 1, max: 4 }),
        author: faker.internet.username(),
        createdAt: createdAt,
        isPinned: faker.datatype.boolean({ probability: 0.05 }),
        image: faker.datatype.boolean({ probability: 0.3 }) ? faker.image.urlLoremFlickr({ category: 'nature' }) : null,
        replyCount: numReplies,
        lastReply: numReplies > 0 ? lastReplyTime : null,
      };
      allThreads.push(newThread);
    }

    // Update the board's thread count with the correct Drizzle syntax
    await db.update(schema.boards).set({ threadCount: boardThreadCount }).where(eq(schema.boards.id, board.id));
  }
  console.log(`✅ Generated ${allThreads.length} threads and ${allReplies.length} replies.`);

  async function batchInsert<T>(table: any, values: T[], batchSize = 300) {
    for (let i = 0; i < values.length; i += batchSize) {
      const batch = values.slice(i, i + batchSize);
      await db.insert(table).values(batch);
      console.log(`✅ Inserted ${i + batch.length}/${values.length} rows into ${table[Symbol.for("drizzle:tableName")]}`);
    }
  }

  // --- 3. BATCH INSERT ALL DATA ---
  console.log("🌱 Inserting all data into the database...");
  if (allThreads.length > 0) {
    await batchInsert(schema.threads, allThreads, 300);
  }
  if (allReplies.length > 0) {
    await batchInsert(schema.replies, allReplies, 300);
  }
  console.log("✅ Data insertion complete.");


  console.log("🎉 Development database seeded successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
