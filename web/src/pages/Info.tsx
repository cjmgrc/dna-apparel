import { For } from "cajoa";

const qa: [string, string][] = [
  ["About DNA", "We make small runs of heavyweight basics. When a drop sells out it is gone."],
  ["Delivery", "₱150 flat, free over ₱3,000. Metro Manila 2 to 3 days, provinces 4 to 7 days."],
  ["Returns and exchanges", "Return unworn pieces with tags within 14 days for store credit or a refund."],
  ["Size guide", "Tees and hoodies are boxy. Chest width (cm): XS 54, S 56, M 58, L 60, XL 62."],
  ["Payment", "Cash on delivery, GCash and cards. Checkout here is a frontend demo."],
  ["Contact", "hello@dna-apparel.example, Mon to Sat, 9am to 6pm."],
];

export function Info() {
  return (
    <div class="wrap page narrow">
      <h1 class="h-md">Help and info</h1>
      <For each={qa}>{(r: [string, string]) => (<details data-r><summary>{r[0]}</summary><p class="mut">{r[1]}</p></details>)}</For>
    </div>
  );
}
