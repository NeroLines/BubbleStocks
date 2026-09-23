// Maps a meme's mascot to its generated coin art. The bubble scene + every card
// read from here so there is one source of truth and zero raw emoji in the UI.
const ARCHETYPE: Record<string, string> = {
  "🐱": "cat", "🐸": "frog", "🐶": "dog", "🐂": "bull", "🐻": "bear",
};

export function coinArt(emoji: string): string {
  return ARCHETYPE[emoji] ?? "cat";
}

export function coinSrc(emoji: string): string {
  return `/coins/${coinArt(emoji)}.jpg`;
}
