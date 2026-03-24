// lib/services/ai-moderation.service.ts

export interface AIModerationResult {
  isViolation: boolean;
  reason: string;
  flaggedBy?: "keyword" | "ai" | "none";
  scores?: AICategoryScores;
}

export interface AICategoryScores {
  pornografi: number;
  perjudian: number;
  sara: number;
  kekerasan: number;
  penipuan: number;
  narkoba: number;
}

const VIOLATION_THRESHOLDS: Record<keyof AICategoryScores, number> = {
  pornografi: 0.65,
  perjudian:  0.70,
  sara:       0.65,
  kekerasan:  0.72, // Dinaikkan dari 0.60 — ekspresi frustrasi ("bunuh lo") umum di imageboard
  penipuan:   0.75,
  narkoba:    0.70,
};

export class AIModerationService {
  private apiKey: string | undefined;

  // Keywords that are almost certainly spam or illegal advertisements
  private highPriorityKeywords: string[] = [
    "judislot", "gacor", "slotmaxwin", "rtpslot", "judionline", "casinoonline",
    "bandarjudi", "betslot", "jualobataborsi", "hackrekening", "investasibodong",
    "jualdata", "pinjoltanpaproses", "jualnarkoba", "jihadfisabilillah"
  ];

  // Keywords that are sensitive but often used in banter/jokes.
  // These are forwarded to the AI as context hints, not instant flags.
  private contextKeywords: string[] = [
    "bokep", "openbo", "vcs", "lendir", "bugil", "telanjang", "porno",
    "seks", "masturbasi", "onlyfans", "abgnakal", "jablay", "mesum",
    "cabul", "pelecehan", "psk", "pelacur", "escort", "gigolo", "mucikari",
    "narkoba", "sabu", "ganja", "ekstasi", "kokain", "putaw",
    "perkosa", "diperkosa", "molestasi", "pemerkosaan",
    "bunuh", "bom", "terorisme", "sara", "kafir", "anjing", "babi"
  ];

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
  }

  /**
   * Normalizes text for keyword matching.
   * Replaces common leet-speak substitutions but preserves spaces
   * so that multi-word keyword detection stays accurate.
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/0/g, "o")
      .replace(/1/g, "i")
      .replace(/3/g, "e")
      .replace(/4/g, "a")
      .replace(/5/g, "s")
      .replace(/8/g, "b")
      .replace(/[^a-z ]/g, ""); // Pertahankan spasi agar frasa multi-kata tetap bisa dideteksi
  }

  /**
   * Evaluates text content for potential violations of rules and Indonesian laws.
   * Laws considered:
   * - UU ITE (Pornography, Gambling, Hate Speech, Information manipulation)
   * - UU Pornografi
   * - KUHP (Violence threats, Drugs)
   *
   * Returns immediately if a high-priority keyword is matched (no AI call needed).
   * Context keywords are passed to the AI as hints rather than instant flags.
   * If keyword check passes, the text is sent to Gemini for context-aware analysis.
   */
  async evaluateText(content: string): Promise<AIModerationResult> {
    const normalizedContent = this.normalizeText(content);

    // --- Step 1: High-priority keyword check (instant flag) ---
    let matchedHighPriority: string | null = null;
    for (const keyword of this.highPriorityKeywords) {
      if (normalizedContent.includes(this.normalizeText(keyword))) {
        matchedHighPriority = keyword;
        break;
      }
    }

    if (matchedHighPriority) {
      console.warn(
        `[AIModeration][HighPriority] ✗ FLAGGED — matched: "${matchedHighPriority}"`
      );
      return {
        isViolation: true,
        reason: `Terdeteksi konten terlarang/spam (High Priority): "${matchedHighPriority}"`,
        flaggedBy: "keyword",
      };
    }

    console.log("[AIModeration][Keyword] ✓ PASSED — no high-priority keywords found.");

    // --- Step 2: Collect context keyword hints for the AI ---
    const detectedContextWords = this.contextKeywords.filter((kw) =>
      normalizedContent.includes(this.normalizeText(kw))
    );

    if (detectedContextWords.length > 0) {
      console.log(
        `[AIModeration][Context] Detected context words: [${detectedContextWords.join(", ")}] — forwarding to AI.`
      );
    }

    if (!this.apiKey) {
      console.warn(
        "[AIModeration][AI] GEMINI_API_KEY is not set. Skipping AI check."
      );
      return { isViolation: false, reason: "", flaggedBy: "none" };
    }

    const sanitizedContent = content
      .replace(/"""/g, "'''")
      .replace(/```/g, "~~~")
      .replace(/\[SYSTEM\]/gi, "[SYS_BLOCKED]")
      .replace(/\[INST\]/gi, "[INST_BLOCKED]")
      .replace(/###/g, "##");

    const contextHint =
      detectedContextWords.length > 0
        ? `\nKata sensitif yang terdeteksi dalam teks: [${detectedContextWords.join(", ")}]. Gunakan ini sebagai petunjuk konteks — bukan bukti pelanggaran.`
        : "";

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: {
              parts: [
                {
                  text: `Anda adalah sistem moderasi otomatis untuk forum imageboard (seperti 4chan/lainchan) versi Indonesia.
Teks yang dimoderasi sebagian besar dalam Bahasa Indonesia, termasuk slang, bahasa gaul, dan campuran bahasa daerah.
Tugas Anda adalah membedakan antara "Banter/Shitposting" yang kasar namun tidak melanggar hukum, dengan "Pelanggaran Nyata" yang harus dihapus.

PRINSIP MODERASI:
1. TOLERANSI TINGGI terhadap bahasa kasar, slang, ejekan, dan topik sensitif selama itu adalah bagian dari budaya imageboard (banter).
2. JANGAN FLAG jika teks hanya berisi kata-kata kotor atau umpatan (misal: "anjing", "babi", "tolol") tanpa maksud melakukan kejahatan atau ancaman nyata.
3. JANGAN FLAG jika teks hanya menyebutkan topik dewasa (seperti "bokep", "sara", "narkoba") dalam konteks diskusi atau lelucon, BUKAN promosi/jualan/distribusi.
4. JANGAN FLAG ekspresi frustrasi umum seperti "gua bunuh lo", "mati aja lo" — ini hampir selalu banter, bukan ancaman nyata.
5. FLAG DENGAN KERAS (Skor > 0.8) jika:
   - Jualan/Promosi (Judi, Narkoba, Obat Ilegal, Phishing).
   - Distribusi materi pornografi nyata atau link ilegal.
   - Ancaman pembunuhan atau terorisme yang terdengar serius dan spesifik.
   - Ujaran kebencian yang sangat ekstrem dan menghasut kekerasan fisik (bukan sekadar ejekan antar anonim).

Kategori yang dinilai (0.0 - 1.0):
1. pornografi  — Fokus pada jualan/distribusi/link, bukan sekadar obrolan mesum.
2. perjudian   — Fokus pada promosi/iklan/link judi.
3. sara        — Hanya flag jika sangat ekstrem dan mengajak kekerasan/genosida.
4. kekerasan   — Ancaman fisik nyata dan spesifik, rencana teroris, atau instruksi pembuatan senjata.
5. penipuan    — Scam, phishing, link pinjol ilegal, penyebaran data pribadi (doxxing).
6. narkoba     — Jual/beli atau instruksi pembuatan narkotika.
${contextHint}
Format output WAJIB (JSON saja):
{
  "scores": {
    "pornografi": number,
    "perjudian": number,
    "sara": number,
    "kekerasan": number,
    "penipuan": number,
    "narkoba": number
  },
  "reasoning": "string (penjelasan singkat: apakah ini banter biasa atau pelanggaran nyata?)"
}`,
                },
              ],
            },
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: sanitizedContent,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          const errorBody = await response.text().catch(() => "(failed to read body)");
          console.warn(
            `[AIModeration][AI] Rate limit exceeded (429). Skipping AI check for this post. Body: ${errorBody}`
          );
          return { isViolation: false, reason: "", flaggedBy: "none" };
        }
        throw new Error(
          `Gemini API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (resultText) {
        let result: { scores?: Partial<AICategoryScores>; reasoning?: string };

        // Wrap JSON.parse to handle malformed AI responses gracefully
        try {
          result = JSON.parse(resultText);
        } catch (parseError) {
          console.error(
            "[AIModeration][AI] Failed to parse JSON response from Gemini:",
            parseError,
            "Raw response:",
            resultText
          );
          return { isViolation: false, reason: "", flaggedBy: "none" };
        }

        const scores: AICategoryScores = (result.scores ?? {}) as AICategoryScores;

        const triggeredCategories = (Object.keys(VIOLATION_THRESHOLDS) as (keyof AICategoryScores)[])
          .filter((cat) => (scores[cat] ?? 0) >= VIOLATION_THRESHOLDS[cat]);

        const isViolation = triggeredCategories.length > 0;

        if (isViolation) {
          const scoreLog = triggeredCategories
            .map((cat) => `${cat}=${(scores[cat] ?? 0).toFixed(2)}`)
            .join(", ");
          console.warn(
            `[AIModeration][AI] ✗ FLAGGED — triggered: [${scoreLog}] | reason: ${result.reasoning}`
          );
        } else {
          const topScore = Math.max(...Object.values(scores).map(Number));
          console.log(
            `[AIModeration][AI] ✓ PASSED — top score: ${topScore.toFixed(2)} | reason: ${result.reasoning}`
          );
        }

        const reason = isViolation
          ? `Berpotensi melanggar kategori: ${triggeredCategories.join(", ")}. ${result.reasoning}`
          : result.reasoning ?? "";

        return {
          isViolation,
          reason,
          flaggedBy: isViolation ? "ai" : "none",
          scores,
        };
      }
    } catch (error) {
      console.error("[AIModeration][AI] Error evaluating content:", error);
    }

    return { isViolation: false, reason: "", flaggedBy: "none" };
  }
}
