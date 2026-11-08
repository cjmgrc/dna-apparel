import type { Product } from "../data";
import { peso, stats, was } from "../data";
import { add, go, toggleWish, wish } from "../state";
import { Icon } from "./Icon";

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
      <p class="mut sm"><span class="star"><Icon n="star" s={13} />{s.rating}</span><span>{(s.sold / 1000).toFixed(1)}k sold</span></p>
      <div class="cacts">
        <button class="btn solid" disabled={p.soldOut} onClick={() => add(p.id, sz)} aria-label={`Add ${p.name} to bag`}><Icon n="bag" s={18} />{p.soldOut ? "" : <Icon n="plus" s={16} />}</button>
        <button class={wish().includes(p.id) ? "heart on" : "heart"} onClick={() => toggleWish(p.id)} aria-pressed={wish().includes(p.id) ? "true" : "false"} aria-label={`Save ${p.name}`}><Icon n="heart" s={18} /></button>
      </div>
    </article>
  );
}
