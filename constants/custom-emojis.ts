export interface CustomEmoji {
  name: string;
  url: string;
  category?: string;
}

export const CUSTOM_EMOJIS: CustomEmoji[] = [
  { name: "crying", url: "/emojis/121286-crying.png", category: "reactions" },
  { name: "wojackhelmie", url: "/emojis/1310_wojackHelmie.png", category: "wojak" },
  { name: "pepeheart", url: "/emojis/149743-pepeheart.png", category: "pepe" },
  { name: "pepeperfect", url: "/emojis/182109-pepeperfect.png", category: "pepe" },
  { name: "pepewow", url: "/emojis/207091-pepewow.gif", category: "pepe" },
  { name: "feelsbad", url: "/emojis/2587_feelsbad.png", category: "wojak" },
  { name: "pepebanger", url: "/emojis/298876-pepebanger.gif", category: "pepe" },
  { name: "gamer", url: "/emojis/334476-gamer.png", category: "gaming" },
  { name: "crazy-happy", url: "/emojis/352886-crazy-happy.gif", category: "reactions" },
  { name: "soypoint", url: "/emojis/3655-soypoint.png", category: "wojak" },
  { name: "mlady", url: "/emojis/399137-mlady.gif", category: "reactions" },
  { name: "pepeclap", url: "/emojis/431882-pepeclap.gif", category: "pepe" },
  { name: "pepenervous", url: "/emojis/471478-pepenervous.gif", category: "pepe" },
  { name: "wojacktears", url: "/emojis/5181_wojacktears.png", category: "wojak" },
  { name: "pepe", url: "/emojis/552046-pepe.png", category: "pepe" },
  { name: "pepeuwu", url: "/emojis/588971-pepeuwu.gif", category: "pepe" },
  { name: "pepechair", url: "/emojis/635522-pepechair.gif", category: "pepe" },
  { name: "zoomer", url: "/emojis/6486_zoomer.png", category: "wojak" },
  { name: "pepestaring", url: "/emojis/718017-pepestaring.png", category: "pepe" },
  { name: "soychicken", url: "/emojis/7400-soychicken.png", category: "wojak" },
  { name: "fatsoy", url: "/emojis/7463-fatsoy.png", category: "wojak" },
  { name: "hehehe", url: "/emojis/792638-hehehe.gif", category: "reactions" },
  { name: "pepehappy", url: "/emojis/795083-pepehappy.png", category: "pepe" },
  { name: "komooo", url: "/emojis/800258-komooo.png", category: "reactions" },
  { name: "peperich", url: "/emojis/828203-peperich.gif", category: "pepe" },
  { name: "notseething", url: "/emojis/8627_notSeething.png", category: "wojak" },
  { name: "eu", url: "/emojis/901688-eu.png", category: "reactions" },
  { name: "oooo", url: "/emojis/928902-oooo.png", category: "reactions" },
  { name: "feels", url: "/emojis/9347-feels.png", category: "wojak" },
  { name: "raiva", url: "/emojis/955764-raiva.gif", category: "reactions" },
  { name: "pepeclap2", url: "/emojis/961812-pepeclap.gif", category: "pepe" },
  { name: "pepeok", url: "/emojis/974580-pepeok.png", category: "pepe" },
  { name: "tears", url: "/emojis/98212-tears.png", category: "reactions" },
  { name: "feelsgood", url: "/emojis/9848-feelsgood.png", category: "wojak" },
  { name: "bugman", url: "/emojis/bugman.png", category: "wojak" },
  { name: "wojak", url: "/emojis/Wojak.png", category: "wojak" },
];

export const EMOJI_MAP = new Map<string, string>(
  CUSTOM_EMOJIS.map((e) => [e.name.toLowerCase(), e.url])
);

export const SYSTEM_EMOJIS = [
  { name: "car_laugh", emoji: "🤣" },
  { name: "love", emoji: "😍" },
  { name: "laugh", emoji: "😂" },
  { name: "happy", emoji: "😃" },
  { name: "sad", emoji: "😭" },
  { name: "angry", emoji: "😡" },
  { name: "thinking", emoji: "🤔" },
  { name: "wow", emoji: "😮" },
  { name: "cool", emoji: "😎" },
  { name: "sweat", emoji: "😰" },
  { name: "sleep", emoji: "😴" },
  { name: "tongue", emoji: "😛" },
  { name: "heart", emoji: "❤️" },
  { name: "star", emoji: "⭐" },
  { name: "fire", emoji: "🔥" },
  { name: "thumbsup", emoji: "👍" },
  { name: "clap", emoji: "👏" },
  { name: "eye", emoji: "👀" },
];
