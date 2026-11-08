import { createSignal, For, onMount } from "cajoa";
import { Icon } from "../components/Icon";
import { Card } from "../components/Card";
import type { Category, Product } from "../data";
import { categories, peso, products, stats } from "../data";
import { add, go, orderNow } from "../state";

const slides = [
  { t: "Helix tee: new colorways", s: "Back in four colorways.", id: "helix-tee", bg: "#c9dcff", fg: "#1c1c1e" },
  { t: "Hoodie season", s: "Brushed fleece, from ₱3,090.", id: "monolith-hoodie", bg: "#cfe9d6", fg: "#1c1c1e" },
  { t: "Outerwear drop", s: "Small run. No restocks.", id: "vector-bomber", bg: "#ffd9c7", fg: "#1c1c1e" },
];
const vouchers = [["tag", "10% off", "DNA10"], ["truck", "Free delivery", "Over ₱3,000"], ["ret", "Returns", "14 days"]];

export function Discover() {
  const [i, setI] = createSignal(0);
  const [left, setLeft] = createSignal("");
  const [tab, setTab] = createSignal("all");
  const [got, setGot] = createSignal<string[]>([]);
  onMount(() => {
    setInterval(() => setI((n) => (n + 1) % slides.length), 5000);
    const tick = () => {
      const n = new Date(); const e = new Date(n); e.setHours(24, 0, 0, 0);
      const s = Math.floor((e.getTime() - n.getTime()) / 1000);
      setLeft([Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((x) => String(x).padStart(2, "0")).join(" : "));
    };
    tick(); setInterval(tick, 1000);
  });
  const flash = () => products.filter((p) => stats(p).off >= 15 && !p.soldOut).slice(0, 8);
  const feed = () => (tab() === "new" ? products.filter((p) => p.featured) : tab() === "top" ? [...products].sort((a, b) => stats(b).sold - stats(a).sold) : products);
  return (
    <div class="wrap mk">
      <section class="ban" aria-roledescription="carousel" aria-label="Featured">
        <div class="trk" style={{ transform: `translateX(-${i() * 100}%)` }}>
          <For each={slides}>{(s: any) => (
            <div class="sl" style={{ background: s.bg, color: s.fg }}>
              <h1>{s.t}</h1><p>{s.s}</p>
              <button class="btn mag" style={{ "border-color": s.fg }} onClick={() => orderNow(s.id)}>Order now</button>
              <span class="bigmark" aria-hidden="true">DNA</span>
            </div>
          )}</For>
        </div>
        <div class="dots"><For each={slides}>{(s: any, n: () => number) => <button class={i() === n() ? "on" : ""} aria-label={`Slide ${n() + 1}`} onClick={() => setI(n())} />}</For></div>
      </section>

      <ul class="vch">
        <For each={vouchers}>{(v: string[]) => (<li data-r><span class="vi"><Icon n={v[0]} /></span><div><b>{v[1]}</b><span class="mut sm">{v[2]}</span></div><button class="btn" onClick={() => setGot([...got(), v[1]])} disabled={got().includes(v[1])} aria-label={`Claim ${v[1]}`}><Icon n={got().includes(v[1]) ? "check" : "plus"} s={18} /></button></li>)}</For>
      </ul>

      <ul class="ci">
        <For each={categories}>{(c: Category) => (<li data-r><a href={`/categories/${c.id}`} onClick={go}><span class="gl"><Icon n={c.id} s={26} /></span><span>{c.name}</span></a></li>)}</For>
      </ul>

      <section class="fl">
        <div class="fh"><h2><Icon n="bolt" s={22} />Flash</h2><p class="cd" aria-label="Ends in">{left()}</p><a class="mr" href="/shop" onClick={go} aria-label="See all"><Icon n="next" s={18} /></a></div>
        <div class="hs">
          <For each={flash()}>{(p: Product) => { const s = stats(p); return (
            <article class="fc" data-r>
              <a class="tile" href={`/product/${p.id}`} onClick={go} aria-label={p.name} style={{ "--a": p.hex, "--b": p.fg }}><span class="tn">{p.name}</span><u class="off">-{s.off}%</u></a>
              <p class="pr"><b>{peso(p.price).replace(" PHP", "")}</b></p>
              <div class="sl-row"><div class="sold"><i style={{ width: `${s.left}%` }} /></div>{s.left}%</div>
            </article>); }}</For>
        </div>
      </section>

      <section class="feed">
        <div class="tabs" role="tablist">
          <For each={[["all", "For you"], ["new", "New"], ["top", "Top"]]}>{(t: string[]) => (<button role="tab" aria-selected={tab() === t[0] ? "true" : "false"} class={tab() === t[0] ? "on" : ""} onClick={() => setTab(t[0])}>{t[1]}</button>)}</For>
        </div>
        <div class="grid"><For each={feed()}>{(p: Product) => <Card p={p} />}</For></div>
        <a class="btn more" href="/shop" onClick={go}aria-label="See all">All<Icon n="arrow" s={18} /></a>
      </section>
    </div>
  );
}
