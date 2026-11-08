import type { Product } from "../data";
import { peso } from "../data";
import { add, go } from "../state";

export function Card(props: { p: Product }) {
  const p = props.p;
  const href = `/categories/${p.cat}`;
  return (
    <article class="card">
      <a class="tile" href={href} onClick={go} aria-label={p.name} style={{ "--a": p.hex, "--b": p.fg }}>
        {p.img ? <img src={p.img} alt="" /> : <span>{p.name}</span>}
        {p.img2 ? <img class="alt" src={p.img2} alt="" /> : ""}
        {p.soldOut ? <em>Sold out</em> : ""}
      </a>
      <h3><a href={href} onClick={go}>{p.name}</a></h3>
      <p>{peso(p.price)}</p>
      <button class="txt" disabled={p.soldOut} onClick={() => add(p.id)} aria-label={`Add ${p.name} to bag`}>
        {p.soldOut ? "Sold out" : "Add to bag"}
      </button>
    </article>
  );
}
