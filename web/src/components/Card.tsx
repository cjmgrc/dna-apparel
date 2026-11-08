import type { Product } from "../data";
import { peso, stats, was } from "../data";
import { add, go, toggleWish, wish } from "../state";

export function Card(props: { p: Product }) {
  const p = props.p;
  const s = stats(p);
  const href = `/product/${p.id}`;
  const sz = p.cat === "headwear" || p.cat === "bags" ? "One size" : "M";
  return (
    <article class="card" data-r>
      <a class="tile" href={href} onClick={go} aria-label={p.name} style={{ "--a": p.hex, "--b": p.fg }}>
        <span class="tn">{p.name}</span>
        {s.off ? <u class="off">-{s.off}%</u> : ""}
        {p.soldOut ? <em>Sold out</em> : ""}
      </a>
      <h3><a href={href} onClick={go}>{p.name}</a></h3>
      <p class="pr"><b>{peso(p.price).replace(" PHP", "")}</b>{s.off ? <s class="mut">{"₱" + was(p).toLocaleString("en-PH")}</s> : ""}</p>
      <p class="mut sm"><span class="star">★ {s.rating}</span> · {s.sold.toLocaleString("en-PH")} sold</p>
      <p class="tag">Free delivery over ₱3,000</p>
      <div class="cacts">
        <button class="btn solid" disabled={p.soldOut} onClick={() => add(p.id, sz)} aria-label={`Add ${p.name} to bag`}>{p.soldOut ? "Sold out" : "Add"}</button>
        <button class={wish().includes(p.id) ? "heart on" : "heart"} onClick={() => toggleWish(p.id)} aria-pressed={wish().includes(p.id) ? "true" : "false"} aria-label={`Save ${p.name}`}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.800-8 11-8 11z" /></svg>
        </button>
      </div>
    </article>
  );
}
