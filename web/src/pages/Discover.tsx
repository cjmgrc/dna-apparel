import { For } from "cajoa";
import { Card } from "../components/Card";
import type { Product } from "../data";
import { products } from "../data";
import { go, orderNow } from "../state";

function Row(props: { title: string; items: Product[]; href: string }) {
  return (
    <section class="wrap rowsec">
      <div class="head">
        <h2>{props.title}</h2>
        <a href={props.href} onClick={go}>View all</a>
      </div>
      <div class="grid">
        <For each={props.items}>{(p: Product) => <Card p={p} />}</For>
      </div>
    </section>
  );
}

export function Discover() {
  const hero = products.find((p) => p.id === "helix-tee")!;
  const by = (cat: string) => products.filter((p) => p.cat === cat).slice(0, 4);
  return (
    <div>
      <section class="banner" style={{ background: hero.hex, color: hero.fg, "--tile": hero.hex }}>
        <div class="wrap">
          <h1>{hero.name} — new colorways</h1>
          <p>Our best-selling tee is back in new colors. Choose yours and wear it.</p>
          <button class="btn solid" onClick={() => orderNow(hero.id)}>ORDER NOW</button>
        </div>
      </section>
      <Row title="New release" items={products.filter((p) => p.featured).slice(0, 4)} href="/categories" />
      <Row title="Essentials – Tees" items={by("tees")} href="/categories/tees" />
      <Row title="Stay warm" items={by("hoodies")} href="/categories/hoodies" />
    </div>
  );
}
