export interface Category { id: string; name: string; blurb: string }
export interface Product { id: string; name: string; cat: string; price: number; hex: string; fg: string; featured: boolean; blurb: string; soldOut: boolean; img?: string; img2?: string }

export const categories: Category[] = [
  { id: "tees", name: "Tees", blurb: "Heavyweight cotton, boxy cut." },
  { id: "hoodies", name: "Hoodies", blurb: "Brushed fleece, double-lined hoods." },
  { id: "outerwear", name: "Outerwear", blurb: "Bombers and coach jackets." },
  { id: "bottoms", name: "Bottoms", blurb: "Cargos, wide pants, shorts." },
  { id: "headwear", name: "Headwear", blurb: "Caps and beanies." },
  { id: "bags", name: "Bags", blurb: "Totes that carry a full day." },
];

// Text color that stays readable on a flat tile color.
function fgFor(hex: string) {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.3 ? "#4a4f5c" : "#F3F4F1";
}

// id, name, category, price, tile color, featured, blurb
const raw: [string, string, string, number, string, boolean, string, boolean?][] = [
  ["helix-tee", "Helix tee", "tees", 1290, "#9db8f2", true, "Heavyweight cotton, boxy fit, printed at the chest."],
  ["core-tee", "Core tee", "tees", 1190, "#d9dce3", false, "The plain one. 260 gsm and pre-washed."],
  ["trust-tee", "Trust tee", "tees", 1090, "#efe6d5", false, "Boxy crop cut in soft cotton."],
  ["center-tee", "Center tee", "tees", 1190, "#4a4f5c", false, "Chest print, relaxed shoulder."],
  ["monolith-hoodie", "Monolith hoodie", "hoodies", 3290, "#4a4f5c", true, "Brushed fleece with a double-lined hood."],
  ["fold-hoodie", "Fold hoodie", "hoodies", 3090, "#9cc8a8", false, "Relaxed fit with a kangaroo pocket."],
  ["kids-hoodie", "Kids hoodie", "hoodies", 3190, "#9db8f2", false, "Boxy crop with a fleece lining."],
  ["grace-hoodie", "Grace hoodie", "hoodies", 3190, "#d9dce3", false, "Heavy fleece, dropped shoulder."],
  ["vector-bomber", "Vector bomber", "outerwear", 4890, "#f0a98f", true, "Ribbed cuffs, matte shell, zip pockets."],
  ["relay-coach", "Relay coach jacket", "outerwear", 4290, "#4a4f5c", false, "Snap front, lightweight and unlined.", true],
  ["cargo-trouser", "Cargo trouser", "bottoms", 3190, "#9cc8a8", true, "Six pockets and a tapered leg."],
  ["wide-pant", "Wide pant", "bottoms", 2990, "#d9dce3", false, "Straight, wide cut with an elastic back waist."],
  ["signal-cap", "Signal cap", "headwear", 990, "#9db8f2", true, "Six panels with an adjustable strap."],
  ["rib-beanie", "Rib beanie", "headwear", 890, "#4a4f5c", false, "Soft rib knit, one size."],
  ["carry-tote", "Carry tote", "bags", 790, "#efe6d5", false, "Canvas tote with an inner pocket."],
  ["courier-tote", "Courier tote", "bags", 1190, "#f0a98f", false, "Wide shoulder strap and a zip top."],
];

export const products: Product[] = raw.map(([id, name, cat, price, hex, featured, blurb, soldOut]) => ({
  id, name, cat, price, hex, fg: fgFor(hex), featured, blurb, soldOut: !!soldOut,
}));

export const find = (id: string) => products.find((p) => p.id === id);
export const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";
export const peso = (n: number) => "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2 }) + " PHP";
export const FREE_SHIPPING = 3000;
export const SHIPPING = 150;

export const sizesFor = (cat: string) => (cat === "headwear" || cat === "bags" ? ["One size"] : ["XS", "S", "M", "L", "XL"]);

export const stats = (p: Product) => { let h = 0; for (const c of p.id) h = (h * 31 + c.charCodeAt(0)) >>> 0; return { rating: (4 + (h % 10) / 10).toFixed(1), sold: 200 + (h % 4800), off: [0, 10, 15, 20, 25, 30][h % 6], left: 20 + (h % 70) }; };
export const was = (p: Product) => Math.round(p.price / (1 - stats(p).off / 100));
