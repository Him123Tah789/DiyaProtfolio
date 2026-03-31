import type { LoveStore } from "@/lib/love-store";

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let message = "Request failed";

    try {
      const payload = (await response.json()) as { message?: unknown };
      if (typeof payload.message === "string" && payload.message.trim()) {
        message = payload.message;
      }
    } catch {
      // Fallback to generic message when server did not return JSON.
    }

    throw new Error(message);
  }

  return (await response.json()) as T;
};

export const fetchLoveStore = async () => {
  const response = await fetch("/api/love", {
    method: "GET",
    cache: "no-store",
  });

  return parseResponse<LoveStore>(response);
};

export const saveLoveStory = async (story: string) => {
  const response = await fetch("/api/love/story", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ story }),
  });

  await parseResponse<{ ok: boolean }>(response);
};

export const saveLoveMemory = async (id: string, text: string, createdAt: string) => {
  const response = await fetch("/api/love/memories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, text, createdAt }),
  });

  await parseResponse<{ ok: boolean }>(response);
};

export const removeLoveMemory = async (id: string) => {
  const response = await fetch(`/api/love/memories?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  await parseResponse<{ ok: boolean }>(response);
};

export const saveLoveImage = async (payload: {
  id: string;
  caption: string;
  createdAt: string;
  dataUrl: string;
}) => {
  const response = await fetch("/api/love/images", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<{ id: string; url: string; caption: string; createdAt: string }>(response);
};

export const removeLoveImage = async (id: string) => {
  const response = await fetch(`/api/love/images?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  await parseResponse<{ ok: boolean }>(response);
};
