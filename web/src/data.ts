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
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.3 ? "#15171A" : "#F3F4F1";
}

// id, name, category, price, tile color, featured, blurb
const raw: [string, string, string, number, string, boolean, string, boolean?][] = [
  ["helix-tee", "Helix tee", "tees", 1290, "#2438FF", true, "Heavyweight cotton, boxy fit, printed at the chest."],
  ["core-tee", "Core tee", "tees", 1190, "#CDD0CC", false, "The plain one. 260 gsm and pre-washed."],
  ["trust-tee", "Trust tee", "tees", 1090, "#E4E0D3", false, "Boxy crop cut in soft cotton."],
  ["center-tee", "Center tee", "tees", 1190, "#15171A", false, "Chest print, relaxed shoulder."],
  ["monolith-hoodie", "Monolith hoodie", "hoodies", 3290, "#15171A", true, "Brushed fleece with a double-lined hood."],
  ["fold-hoodie", "Fold hoodie", "hoodies", 3090, "#4F5D43", false, "Relaxed fit with a kangaroo pocket."],
  ["kids-hoodie", "Kids hoodie", "hoodies", 3190, "#2438FF", false, "Boxy crop with a fleece lining."],
  ["grace-hoodie", "Grace hoodie", "hoodies", 3190, "#CDD0CC", false, "Heavy fleece, dropped shoulder."],
  ["vector-bomber", "Vector bomber", "outerwear", 4890, "#A8452B", true, "Ribbed cuffs, matte shell, zip pockets."],
  ["relay-coach", "Relay coach jacket", "outerwear", 4290, "#15171A", false, "Snap front, lightweight and unlined.", true],
  ["cargo-trouser", "Cargo trouser", "bottoms", 3190, "#4F5D43", true, "Six pockets and a tapered leg."],
  ["wide-pant", "Wide pant", "bottoms", 2990, "#CDD0CC", false, "Straight, wide cut with an elastic back waist."],
  ["signal-cap", "Signal cap", "headwear", 990, "#2438FF", true, "Six panels with an adjustable strap."],
  ["rib-beanie", "Rib beanie", "headwear", 890, "#15171A", false, "Soft rib knit, one size."],
  ["carry-tote", "Carry tote", "bags", 790, "#E4E0D3", false, "Canvas tote with an inner pocket."],
  ["courier-tote", "Courier tote", "bags", 1190, "#A8452B", false, "Wide shoulder strap and a zip top."],
];

export const products: Product[] = raw.map(([id, name, cat, price, hex, featured, blurb, soldOut]) => ({
  id, name, cat, price, hex, fg: fgFor(hex), featured, blurb, soldOut: !!soldOut,
}));

export const find = (id: string) => products.find((p) => p.id === id);
export const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";
export const peso = (n: number) => "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 2 }) + " PHP";
export const FREE_SHIPPING = 3000;
export const SHIPPING = 150;
