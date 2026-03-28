// lib/services/ai-moderation.service.ts
import crypto from "crypto";

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

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 100;
const CACHE_TTL_MS = 3600_000 * 2; // 2 Hours
const MAX_CACHE_SIZE = 2000;

interface CacheEntry {
  result: AIModerationResult;
  expiresAt: number;
}

export class AIModerationService {
  private apiKeys: string[] = [];
  private models: string[] = [
    "gemini-3.1-flash-lite-preview",
    "gemini-3-flash-preview",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash",
  ];

  // Store cooldown as "model:apiKey" -> timestamp
  private cooldowns = new Map<string, number>();
  // Result cache with TTL and size tracking
  private cache = new Map<string, CacheEntry>();

  // Keywords that are almost certainly spam or illegal advertisements
  private highPriorityKeywords: string[] = [
    "judislot", "gacor", "slotmaxwin", "rtpslot", "judionline", "casinoonline",
    "bandarjudi", "betslot", "jualobataborsi", "hackrekening", "investasibodong",
    "jualdata", "pinjoltanpaproses", "jualnarkoba", "jihadfisabilillah"
  ];

  // Keywords that are sensitive but often used in banter/jokes.
  private contextKeywords: string[] = [
    "bokep", "openbo", "vcs", "lendir", "bugil", "telanjang", "porno",
    "seks", "masturbasi", "onlyfans", "abgnakal", "jablay", "mesum",
    "cabul", "pelecehan", "psk", "pelacur", "escort", "gigolo", "mucikari",
    "narkoba", "sabu", "ganja", "ekstasi", "kokain", "putaw",
    "perkosa", "diperkosa", "molestasi", "pemerkosaan",
    "bunuh", "bom", "terorisme", "sara", "kafir", "anjing", "babi"
  ];

  constructor() {
    // Collect all keys from GEMINI_API_KEY (single) or GEMINI_API_KEYS (comma separated)
    const singleKey = process.env.GEMINI_API_KEY;
    const multiKeys = process.env.GEMINI_API_KEYS?.split(",").map(k => k.trim()).filter(Boolean);
    
    if (multiKeys && multiKeys.length > 0) {
      this.apiKeys = multiKeys;
    } else if (singleKey) {
      this.apiKeys = [singleKey];
    }

    // Support custom model list from env if needed
    if (process.env.GEMINI_MODELS) {
      this.models = process.env.GEMINI_MODELS.split(",").map(m => m.trim()).filter(Boolean);
    }
  }

  /**
   * Fisher-Yates shuffle for better randomness.
   */
  private shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Normalizes text for keyword matching.
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
      .replace(/[^a-z ]/g, "");
  }

  /**
   * Evaluates text content for potential violations.
   */
  async evaluateText(content: string): Promise<AIModerationResult> {
    // --- Step 0: Cache Check (with TTL Management) ---
    const hash = crypto.createHash("sha1").update(content).digest("hex");
    const cached = this.cache.get(hash);
    const now = Date.now();

    if (cached) {
      if (cached.expiresAt > now) {
        console.log(`[AIModeration][Cache] HIT — ${hash.slice(0, 8)}`);
        return cached.result;
      } else {
        this.cache.delete(hash); // Cleanup expired entry
      }
    }

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
      const result: AIModerationResult = {
        isViolation: true,
        reason: `Terdeteksi konten terlarang/spam (High Priority): "${matchedHighPriority}"`,
        flaggedBy: "keyword",
      };
      this.saveToCache(hash, result);
      return result;
    }

    // --- Step 2: Context keyword hints ---
    const detectedContextWords = this.contextKeywords.filter((kw) =>
      normalizedContent.includes(this.normalizeText(kw))
    );

    // --- Step 2.1: Early-exit for low-risk content ---
    if (content.length < 20 && detectedContextWords.length === 0) {
      return { isViolation: false, reason: "", flaggedBy: "none" };
    }

    if (this.apiKeys.length === 0) {
      console.warn("[AIModeration][AI] No GEMINI_API_KEY found. Skipping AI check.");
      return { isViolation: false, reason: "", flaggedBy: "none" };
    }

    const sanitizedContent = content
      .replace(/"""/g, "'''")
      .replace(/```/g, "~~~")
      .replace(/\[SYSTEM\]/gi, "[SYS_BLOCKED]")
      .replace(/\[INST\]/gi, "[INST_BLOCKED]")
      .replace(/###/g, "##");

    const contextHint = detectedContextWords.length > 0
      ? `\nKata sensitif terdeteksi (Hanya petunjuk): [${detectedContextWords.join(", ")}].`
      : "";

    // --- Step 3: AI Rotation Logic (Model Priority > Key Rotation) ---
    let attempts = 0;
    let lastError: any = null;

    for (const model of this.models) {
      // Rotate keys for each model for fair distribution
      const keys = this.shuffle(this.apiKeys);

      for (const key of keys) {
        if (attempts >= MAX_ATTEMPTS) break;

        const currentLoopNow = Date.now();
        const cooldownKey = `${model}:${key}`;
        const cooldownUntil = this.cooldowns.get(cooldownKey);
        if (cooldownUntil && cooldownUntil > currentLoopNow) continue;

        attempts++;
        if (attempts > 1) {
          // Small delay before retrying to prevent Hammer Risk
          await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
        }

        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                system_instruction: {
                  parts: [{
                    text: `Anda adalah sistem moderasi otomatis untuk forum imageboard (seperti 4chan) versi Indonesia.
Tugas Anda adalah membedakan antara "Banter/Shitposting" kasar dengan "Pelanggaran Nyata" (Ilegal).

PRINSIP UTAMA:
1. TOLERANSI TINGGI pada bahasa kasar, slang, ejekan, dan teks "toxic" selama itu adalah banter anonim.
2. JANGAN FLAG kata umpatan ("anjing", "babi", dsb) jika tidak ada ancaman/kejahatan nyata.
3. JANGAN FLAG diskusi topik dewasa (bokep, sara, narkoba) SELAMA itu diskusi/lelucon, BUKAN promosi/jualan/distribusi link.
4. FLAG KERAS (> 0.8) pada: Jualan Judi/Narkoba, Link Pornografi Nyata, Phishing/Scam, dan Ancaman Fisik Serius.

Kategori (0.0-1.0):
- pornografi (Fokus: jualan/distribusi)
- perjudian (Fokus: iklan/link)
- sara (Fokus: hasutan kekerasan fisik)
- kekerasan (Fokus: ancaman nyata/spesifik)
- penipuan (Fokus: scam/phishing/doxxing)
- narkoba (Fokus: jual/beli)
${contextHint}
Format output (JSON): {"scores": {...}, "reasoning": "..."}`
                  }],
                },
                contents: [{ role: "user", parts: [{ text: sanitizedContent }] }],
                generationConfig: { responseMimeType: "application/json" },
              }),
            }
          );

          if (!response.ok) {
            // Smart Model Fallback for 404 (Model Not Found)
            if (response.status === 404) {
              console.warn(`[AIModeration] Model ${model} returned 404. Trying next version...`);
              break; // Skip rest of keys for this model, try next model
            }

            if (response.status === 429) {
              console.warn(`[AIModeration][AI] 429 Limit for ${model}:${key.slice(-5)}. Cooling down...`);
              this.cooldowns.set(cooldownKey, Date.now() + 60_000); 
              continue;
            }
            throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!resultText) throw new Error("Empty response from AI");

          let result: { scores?: Partial<AICategoryScores>; reasoning?: string };
          try {
            result = JSON.parse(resultText);
          } catch {
            console.warn(`[AIModeration][AI] Invalid JSON from model ${model}, trying next...`);
            continue;
          }

          const scores: AICategoryScores = (result.scores ?? {}) as AICategoryScores;
          const triggeredCategories = (Object.keys(VIOLATION_THRESHOLDS) as (keyof AICategoryScores)[])
            .filter((cat) => (scores[cat] ?? 0) >= VIOLATION_THRESHOLDS[cat]);

          const isViolation = triggeredCategories.length > 0;
          
          if (isViolation) {
            console.warn(`[AIModeration][AI] ✗ FLAGGED [${model}] — triggered: [${triggeredCategories.join(", ")}]`);
          } else {
            console.log(`[AIModeration][AI] ✓ PASSED [${model}] — reason: ${result.reasoning}`);
          }

          const finalResult: AIModerationResult = {
            isViolation,
            reason: isViolation ? `Berpotensi melanggar: ${triggeredCategories.join(", ")}. ${result.reasoning}` : (result.reasoning ?? ""),
            flaggedBy: isViolation ? "ai" : "none",
            scores,
          };

          // Cache successful result
          this.saveToCache(hash, finalResult);
          return finalResult;

        } catch (error) {
          lastError = error;
          console.error(`[AIModeration][AI] Attempt ${attempts} failed with ${model}:`, error);
        }
      }

      if (attempts >= MAX_ATTEMPTS) break;
    }

    console.error("[AIModeration][AI] All attempts exhausted or failed.", lastError);
    return { isViolation: false, reason: "AI Moderation exhausted", flaggedBy: "none" };
  }

  /**
   * Safely saves a result to the cache with TTL and size management.
   */
  private saveToCache(hash: string, result: AIModerationResult) {
    // Evict oldest entries if cache is full
    if (this.cache.size >= MAX_CACHE_SIZE) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }

    this.cache.set(hash, {
      result,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
  }
}
