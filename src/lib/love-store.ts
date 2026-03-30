export const ACCESS_KEY = "DiyaHimu127";
export const LOVE_STORAGE_KEY = "diyaverse-love-v1";

export type MemoryEntry = {
  id: string;
  text: string;
  createdAt: string;
};

export type LoveImage = {
  id: string;
  dataUrl: string;
  caption: string;
  createdAt: string;
};

export type LoveStore = {
  story: string;
  memories: MemoryEntry[];
  images: LoveImage[];
};

export const initialLoveStore: LoveStore = {
  story: "",
  memories: [],
  images: [],
};

export const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const parseLoveStore = (raw: string | null): LoveStore => {
  if (!raw) {
    return initialLoveStore;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LoveStore>;
    return {
      story: typeof parsed.story === "string" ? parsed.story : "",
      memories: Array.isArray(parsed.memories) ? parsed.memories : [],
      images: Array.isArray(parsed.images) ? parsed.images : [],
    };
  } catch {
    return initialLoveStore;
  }
};

export const loadLoveStore = (): LoveStore => {
  if (typeof window === "undefined") {
    return initialLoveStore;
  }

  return parseLoveStore(window.localStorage.getItem(LOVE_STORAGE_KEY));
};

export const saveLoveStore = (store: LoveStore) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOVE_STORAGE_KEY, JSON.stringify(store));
};
