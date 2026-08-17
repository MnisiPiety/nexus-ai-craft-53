import { useCallback, useEffect, useState } from "react";
import type { EmailInput, EmailResult, MeetingResult, ResearchResult } from "./ai-types";

export type ItemType = "email" | "meeting" | "research";

export type WorkItem =
  | { id: string; type: "email"; title: string; createdAt: number; updatedAt: number; favorite: boolean; input: EmailInput; result: EmailResult }
  | { id: string; type: "meeting"; title: string; createdAt: number; updatedAt: number; favorite: boolean; notes: string; result: MeetingResult }
  | { id: string; type: "research"; title: string; createdAt: number; updatedAt: number; favorite: boolean; topic: string; result: ResearchResult };

const KEY = "aisuite:items";
const listeners = new Set<() => void>();

function read(): WorkItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as WorkItem[];
  } catch {
    return [];
  }
}

function write(items: WorkItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export function saveItem(item: Omit<WorkItem, "createdAt" | "updatedAt" | "favorite"> & Partial<WorkItem>) {
  const items = read();
  const now = Date.now();
  const existing = items.find((i) => i.id === item.id);
  const next = { favorite: false, createdAt: now, ...existing, ...item, updatedAt: now } as WorkItem;
  write([next, ...items.filter((i) => i.id !== item.id)]);
  return next;
}

export function deleteItem(id: string) {
  write(read().filter((i) => i.id !== id));
}

export function toggleFavorite(id: string) {
  write(read().map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i)));
}

export function renameItem(id: string, title: string) {
  write(read().map((i) => (i.id === id ? { ...i, title } : i)));
}

export function useItems() {
  const [items, setItems] = useState<WorkItem[]>([]);
  useEffect(() => {
    const sync = () => setItems(read());
    sync();
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);
  return items;
}

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  useEffect(() => {
    const stored = window.localStorage.getItem("aisuite:theme");
    const initial =
      stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
    setThemeState(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);
  const setTheme = useCallback((next: "light" | "dark") => {
    setThemeState(next);
    window.localStorage.setItem("aisuite:theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);
  return { theme, setTheme };
}

/** Cross-tool handoff (meeting -> email, research -> meeting, etc.). */
export type Handoff =
  | { kind: "email"; input: Partial<EmailInput> }
  | { kind: "meeting"; notes: string; title?: string }
  | { kind: "research"; topic: string };

const HANDOFF_KEY = "aisuite:handoff";

export function setHandoff(handoff: Handoff) {
  window.sessionStorage.setItem(HANDOFF_KEY, JSON.stringify(handoff));
}

export function takeHandoff<T extends Handoff["kind"]>(kind: T): Extract<Handoff, { kind: T }> | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(HANDOFF_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Handoff;
    if (parsed.kind !== kind) return null;
    window.sessionStorage.removeItem(HANDOFF_KEY);
    return parsed as Extract<Handoff, { kind: T }>;
  } catch {
    return null;
  }
}

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}
