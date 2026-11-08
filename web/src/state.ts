import { createSignal, navigate } from "cajoa";
import { find } from "./data";

const read = <T>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage is not available
  }
};

export interface Line { id: string; qty: number }
export interface User { name: string; email: string }

// --- routing helpers (own path signal so every component can react to it)
export const [path, setPath] = createSignal(location.pathname);
export const nav = (to: string, replace = false) => {
  navigate(to, { replace });
  setPath(location.pathname);
};
addEventListener("popstate", () => setPath(location.pathname));

export const go = (e: MouseEvent) => {
  if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  setBagOpen(false);
  setNotice(null);
  nav((e.currentTarget as HTMLAnchorElement).getAttribute("href")!);
};

// --- bag
export const [bag, setBag] = createSignal<Line[]>(read("dna.bag", []));
export const [bagOpen, setBagOpen] = createSignal(false);
export const [notice, setNotice] = createSignal<string | null>(null);
let timer: number | undefined;
const save = (l: Line[]) => {
  setBag(l);
  write("dna.bag", l);
};
export const add = (pid: string, size = "M") => {
  const id = `${pid}|${size}`;
  const l = bag();
  save(l.some((x) => x.id === id) ? l.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)) : [...l, { id, qty: 1 }]);
  setNotice(pid);
  clearTimeout(timer);
  timer = window.setTimeout(() => setNotice(null), 8000);
};
export const remove = (id: string) => save(bag().filter((x) => x.id !== id));
export const clearBag = () => save([]);
export const count = () => bag().reduce((n, l) => n + l.qty, 0);
export const gross = () => bag().reduce((n, l) => n + l.qty * (find(l.id.split("|")[0])?.price ?? 0), 0);

// --- auth (frontend only: swap signIn's caller for your API)
export const [user, setUser] = createSignal<User | null>(read("dna.user", null));
export const [pending, setPending] = createSignal<string | null>(null);
export const signIn = (u: User) => {
  setUser(u);
  write("dna.user", u);
};
export const signOut = () => {
  setUser(null);
  write("dna.user", null);
};

// The only thing that opens the login page: ordering without an account.
export function requestOrder() {
  setBagOpen(false);
  setNotice(null);
  if (user()) return nav("/checkout");
  setPending("/checkout");
  nav("/login");
}
export const orderNow = (id: string, size = "M") => {
  add(id, size);
  requestOrder();
};

export const [promo, setPromo] = createSignal(read("dna.promo", ""));
export const applyPromo = (c: string) => { const v = c.trim().toUpperCase(); setPromo(v === "DNA10" ? v : ""); write("dna.promo", promo()); return promo() !== ""; };
export const subtotal = () => Math.round(gross() * (promo() ? 0.9 : 1));
export const setQty = (id: string, d: number) => save(bag().map((x) => (x.id === id ? { ...x, qty: x.qty + d } : x)).filter((x) => x.qty > 0));
export const [wish, setWish] = createSignal<string[]>(read("dna.wish", []));
export const toggleWish = (id: string) => { const w = wish().includes(id) ? wish().filter((x) => x !== id) : [...wish(), id]; setWish(w); write("dna.wish", w); };

export const [query, setQuery] = createSignal("");
