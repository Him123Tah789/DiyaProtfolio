export const ACCESS_KEY = "DiyaHimu127";

export type MemoryEntry = {
  id: string;
  text: string;
  createdAt: string;
};

export type LoveImage = {
  id: string;
  url: string;
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
