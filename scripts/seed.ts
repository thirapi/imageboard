import { db } from "@/db";
import { boards } from "@/db/schema";

async function seedBoards() {
  const existing = await db.select().from(boards);

  if (existing.length > 0) {
    console.log("✅ Boards already seeded, skipping.");
    return;
  }

await db.insert(boards).values([
  {
    id: "g",
    name: "Technology",
    description: "All about tech, programming, and gadgets.",
  },
  {
    id: "a",
    name: "Anime",
    description: "Discussions about anime, manga, and Japanese culture.",
  },
  {
    id: "b",
    name: "Random",
    description: "Anything goes here.",
  },
]);


  console.log("🌱 Boards seeded successfully!");
}

seedBoards()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
