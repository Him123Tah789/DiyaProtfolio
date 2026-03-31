export const flowerIcons = ["🌸", "🌷", "🌺", "🌹", "🌼", "🪷"];
export const loveIcons = ["❤", "💗", "💖", "💘", "💕", "💞", "💓", "🩷", "💜"];
export const objectIcons = ["✨", "⭐", "💫", "🎀", "🫧", "💍", "🕊️"];
export const colors = [
  "#ff5f9e",
  "#a96ae0",
  "#ff7f7f",
  "#6f9dff",
  "#ff9ec7",
  "#ffb347",
  "#53c6ac",
  "#d277ff",
  "#ff6699",
];

type RandomWanderItem = {
  id: string;
  left: string;
  top: string;
  delay: string;
  duration: string;
  size: string;
  color: string;
  x1: string;
  y1: string;
  x2: string;
  y2: string;
  x3: string;
  y3: string;
  x4: string;
  y4: string;
  r1: string;
  r2: string;
  r3: string;
  r4: string;
};

export type MovingItem = RandomWanderItem & {
  icon: string;
};

export type NameBit = RandomWanderItem & {
  text: "Diya" | "Himu";
};

const createSeededRandom = (seed: number) => {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
};

const randomRange = (random: () => number, min: number, max: number) =>
  min + (max - min) * random();

export const makeFloodItems = (count: number, icons: string[]) =>
  Array.from({ length: count }).map((_, index) => ({
    id: `f-${index}`,
    left: `${(index * 13 + (index % 7) * 5) % 100}%`,
    delay: `${(index * 0.35) % 8}s`,
    duration: `${4.2 + (index % 5) * 0.85}s`,
    size: `${1 + (index % 3) * 0.35}rem`,
    icon: icons[index % icons.length],
    color: colors[index % colors.length],
  }));

export const makeRandomMotionItems = (count: number, icons: string[], seed: number): MovingItem[] => {
  const random = createSeededRandom(seed);

  return Array.from({ length: count }).map((_, index) => ({
    id: `m-${index}`,
    left: `${Math.round(randomRange(random, 2, 96))}%`,
    top: `${Math.round(randomRange(random, 4, 94))}%`,
    delay: `${randomRange(random, 0, 3.5).toFixed(2)}s`,
    duration: `${randomRange(random, 4.2, 7.1).toFixed(2)}s`,
    size: `${randomRange(random, 0.95, 1.75).toFixed(2)}rem`,
    icon: icons[index % icons.length],
    color: colors[(index + 3) % colors.length],
    x1: `${Math.round(randomRange(random, -26, 26))}px`,
    y1: `${Math.round(randomRange(random, -22, 22))}px`,
    x2: `${Math.round(randomRange(random, -30, 30))}px`,
    y2: `${Math.round(randomRange(random, -30, 30))}px`,
    x3: `${Math.round(randomRange(random, -36, 36))}px`,
    y3: `${Math.round(randomRange(random, -36, 36))}px`,
    x4: `${Math.round(randomRange(random, -46, 46))}px`,
    y4: `${Math.round(randomRange(random, -46, 46))}px`,
    r1: `${Math.round(randomRange(random, -18, 18))}deg`,
    r2: `${Math.round(randomRange(random, -25, 25))}deg`,
    r3: `${Math.round(randomRange(random, -35, 35))}deg`,
    r4: `${Math.round(randomRange(random, -42, 42))}deg`,
  }));
};

export const makeNameBits = (count: number, seed: number): NameBit[] => {
  const random = createSeededRandom(seed);

  return Array.from({ length: count }).map((_, index) => ({
    id: `n-${index}`,
    text: index % 2 === 0 ? "Diya" : "Himu",
    left: `${Math.round(randomRange(random, 1, 98))}%`,
    top: `${Math.round(randomRange(random, 3, 97))}%`,
    delay: `${randomRange(random, 0, 4.5).toFixed(2)}s`,
    duration: `${randomRange(random, 6.2, 10.2).toFixed(2)}s`,
    size: `${randomRange(random, 0.46, 0.76).toFixed(2)}rem`,
    color: index % 2 === 0 ? "#ff3a88" : "#9a35ff",
    x1: `${Math.round(randomRange(random, -18, 18))}px`,
    y1: `${Math.round(randomRange(random, -14, 14))}px`,
    x2: `${Math.round(randomRange(random, -22, 22))}px`,
    y2: `${Math.round(randomRange(random, -20, 20))}px`,
    x3: `${Math.round(randomRange(random, -24, 24))}px`,
    y3: `${Math.round(randomRange(random, -20, 20))}px`,
    x4: `${Math.round(randomRange(random, -28, 28))}px`,
    y4: `${Math.round(randomRange(random, -24, 24))}px`,
    r1: `${Math.round(randomRange(random, -10, 10))}deg`,
    r2: `${Math.round(randomRange(random, -13, 13))}deg`,
    r3: `${Math.round(randomRange(random, -18, 18))}deg`,
    r4: `${Math.round(randomRange(random, -22, 22))}deg`,
  }));
};

export const makeBloomBursts = () =>
  Array.from({ length: 18 }).map((_, index) => ({
    id: `b-${index}`,
    left: `${8 + index * 8}%`,
    top: `${10 + (index % 4) * 18}%`,
    delay: `${(index * 0.6) % 7}s`,
    duration: `${2.2 + (index % 4) * 0.7}s`,
    color: colors[index % colors.length],
  }));

export const makeBloomFlowers = () =>
  Array.from({ length: 48 }).map((_, index) => ({
    id: `bf-${index}`,
    left: `${(index * 17 + (index % 3) * 6) % 100}%`,
    top: `${(index * 7 + (index % 4) * 11) % 100}%`,
    delay: `${(index * 0.42) % 11}s`,
    duration: `${2.4 + (index % 6) * 0.62}s`,
    size: `${0.8 + (index % 4) * 0.4}rem`,
    flower: flowerIcons[index % flowerIcons.length],
    color: colors[(index + 4) % colors.length],
  }));