import { createSignal, For, Show } from "cajoa";
import { Icon } from "../components/Icon";
import { Card } from "../components/Card";
import type { Category, Product } from "../data";
import { categories, products } from "../data";
import { go, path, query, setQuery } from "../state";

const MIN = Math.min(...products.map((p) => p.price));
const MAX = Math.max(...products.map((p) => p.price));
const pct = (n: number) => ((n - MIN) / (MAX - MIN)) * 100;
const fmt = (n: number) => "₱" + n.toLocaleString("en-PH");

export function Categories() {
  const [lo, setLo] = createSignal(MIN);
  const [hi, setHi] = createSignal(MAX);
  const [sort, setSort] = createSignal("new");
  const [stock, setStock] = createSignal(false);
  const slug = () => path().split("/")[2] ?? "";
  const list = () => {
    let l = products.filter((p) => (!slug() || p.cat === slug()) && p.name.toLowerCase().includes(query().toLowerCase()) && p.price >= lo() && p.price <= hi() && (!stock() || !p.soldOut));
    if (sort() === "lo") l = [...l].sort((a, b) => a.price - b.price);
    if (sort() === "hi") l = [...l].sort((a, b) => b.price - a.price);
    return l;
  };
  return (
    <div class="wrap page">
      <h1 class="h-md" data-r>Shop</h1>
      <ul class="cats">
        <li><a class={slug() === "" ? "line on" : "line"} href="/shop" onClick={go}>All</a></li>
        <For each={categories}>{(c: Category) => (<li><a class={slug() === c.id ? "line on" : "line"} href={`/categories/${c.id}`} onClick={go} aria-current={slug() === c.id ? "page" : "false"}>{c.name}</a></li>)}</For>
      </ul>
      <div class="bar">
        <label class="sr" for="q">Search pieces</label>
        <input id="q" type="search" placeholder="Search pieces" value={query} onInput={(e) => setQuery((e.target as HTMLInputElement).value)} />
        <label class="sr" for="so">Sort</label>
        <select id="so" onChange={(e) => setSort((e.target as HTMLSelectElement).value)}><option value="new">Newest</option><option value="lo">Price: low to high</option><option value="hi">Price: high to low</option></select>
        <label class="chk"><input type="checkbox" onChange={(e) => setStock((e.target as HTMLInputElement).checked)} /> In stock only</label>
        <p class="mut" aria-live="polite">{list().length} pieces</p>
      </div>
      <div class="price">
        <Icon n="sliders" s={20} />
        <span class="pv">{fmt(lo())}</span>
        <div class="dual">
          <i style={{ left: `${pct(lo())}%`, right: `${100 - pct(hi())}%` }} />
          <input type="range" aria-label="Minimum price" min={MIN} max={MAX} step="10" value={lo} onInput={(e) => { const el = e.target as HTMLInputElement; const v = Math.min(+el.value, hi()); el.value = String(v); setLo(v); }} />
          <input type="range" aria-label="Maximum price" min={MIN} max={MAX} step="10" value={hi} onInput={(e) => { const el = e.target as HTMLInputElement; const v = Math.max(+el.value, lo()); el.value = String(v); setHi(v); }} />
        </div>
        <span class="pv">{fmt(hi())}</span>
        <button class="icon-btn" aria-label="Reset price" onClick={() => { setLo(MIN); setHi(MAX); }}><Icon n="ret" s={18} /></button>
      </div>
      <Show when={list().length === 0}><p class="mut">Nothing matches. Clear the search or pick another category.</p></Show>
      <div class="grid"><For each={list()}>{(p: Product) => <Card p={p} />}</For></div>
    </div>
  );
}
