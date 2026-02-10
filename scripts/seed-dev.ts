
import { db } from "../lib/db";
import { threads, replies, boards } from "../lib/db/schema";
import { sql } from "drizzle-orm";
import { config } from "dotenv";

config({ path: ".env.local" });

const seedData = [
    // /wibu/ - Anime & Manga
    {
        boardCode: "wibu",
        subject: "Diskusi Anime Musim Ini",
        content: "Apa anime terbaik musim ini menurut kalian? >tfw belum nonton apapun",
        replies: [
            "Jelas Frieren lah, ga ada obat grafisnya.",
            ">>1\nDungeon Meshi juga bagus bang, world buildingnya top tier.",
            ">belum nonton apapun\nNgapain aja hidup lu?"
        ]
    },
    {
        boardCode: "wibu",
        subject: "Manga Recommendation",
        content: "Ada yang tau judul manga ini? MC-nya bisa masak di dungeon...",
        replies: [
            "Dungeon Meshi?",
            "Campfire Cooking in Another World kali"
        ]
    },

    // /gim/ - Video Games
    {
        boardCode: "gim",
        subject: "Rakitan PC 5 Juta",
        content: "Minta saran rakitan PC budget 5 juta dong gan. Buat main Valorant sama coding tipis-tipis.",
        replies: [
            "Mending rakit ryzen 5600g dulu, vga nyusul.",
            ">>1\nCari bekas aja dapet yg lebih bagus.",
            "Tambah dikit lagi dapet RX 6600 bekas tambang."
        ]
    },
    {
        boardCode: "gim",
        subject: "Elden Ring DLC",
        content: "Kapan rilis woy? Udah tamat 5x nih.",
        replies: []
    },

    // /pol/
    {
        boardCode: "pol",
        subject: "Debat Capres",
        content: "Gimana menurut kalian performa paslon di debat kemarin?",
        replies: [
            "Semuanya sama aja, janji doang.",
            ">percaya politisi di tahun 2026\nNGMI"
        ]
    },

    // /b/ - Random
    {
        boardCode: "b",
        subject: undefined,
        content: "Roll thread. Cek digit terakhir post lu.",
        replies: [
            "Roll",
            "Check",
            "Dubs get"
        ]
    },
    {
        boardCode: "b",
        subject: "Cerita Horror",
        content: "Ada yang punya pengalaman mistis di kostan? Share dong.",
        replies: [
            "Dulu pas ngekost di Jogja sering denger suara gamelan jam 2 malem.",
            ">>1\n[spoiler]Sebenarnya itu suara tetangga lagi latihan[/spoiler]"
        ]
    }
];

async function seed() {
    console.log("🌱 Seeding development data via Drizzle...");

    try {
        // 1. Get Board IDs map
        const allBoards = await db.select().from(boards);

        if (allBoards.length === 0) {
            console.error("❌ No boards found. Run migration/seed-boards first!");
            process.exit(1);
        }

        const boardMap = new Map(allBoards.map(b => [b.code, b.id]));

        for (const data of seedData) {
            const boardId = boardMap.get(data.boardCode);

            if (!boardId) {
                console.warn(`⚠️ Board /${data.boardCode}/ not found, skipping.`);
                continue;
            }

            // 2. Insert Thread
            const [newThread] = await db.insert(threads).values({
                boardId,
                subject: data.subject || null,
                content: data.content,
                // Remove updatedAt as it doesn't exist in schema
                // Use sequence for postNumber
                postNumber: sql`nextval('post_number_seq')`,
            }).returning();

            console.log(`✅ POST /${data.boardCode}/${newThread.id} (No.${newThread.postNumber})`);

            // 3. Insert Replies
            if (data.replies.length > 0) {
                // Replace >>1 with actual OP number
                const formattedReplies = data.replies.map(content => ({
                    threadId: newThread.id,
                    content: content.replace(">>1", `>>${newThread.postNumber}`)
                }));

                await db.insert(replies).values(formattedReplies);
                console.log(`   ↳ Added ${data.replies.length} replies`);
            }
        }

        console.log("✨ Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding error:", error);
        process.exit(1);
    }
}

seed();
