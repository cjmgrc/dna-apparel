import { For } from "cajoa";
import { Icon } from "../components/Icon";

const qa: [string, string, string][] = [
  ["tag", "About DNA", "Small runs of heavyweight basics. When a drop sells out, it is gone."],
  ["truck", "Delivery", "₱150 flat, free over ₱3,000. Metro Manila 2–3 days, provinces 4–7 days."],
  ["ret", "Returns", "Unworn pieces with tags within 14 days, for store credit or a refund."],
  ["tees", "Size guide", "Boxy fit. Chest width (cm): XS 54 · S 56 · M 58 · L 60 · XL 62."],
  ["ticket", "Payment", "Cash on delivery, GCash and cards. This checkout is a demo."],
  ["mail", "Contact", "hello@dna-apparel.example · Mon–Sat, 9am–6pm."],
];

export function Info() {
  return (
    <div class="wrap page narrow">
      <h1 class="h-md">Help</h1>
      <For each={qa}>{(r: string[]) => (<details data-r><summary><span class="vs"><Icon n={r[0]} s={18} />{r[1]}</span></summary><p class="mut">{r[2]}</p></details>)}</For>
    </div>
  );
}
