import { createSignal, For, Show } from "cajoa";
import { Card } from "../components/Card";
import { catName, find, peso, products, sizesFor } from "../data";
import { add, go, orderNow, path, toggleWish, wish } from "../state";

export function Product() {
  const p = () => find(path().split("/")[2] ?? "");
  const [size, setSize] = createSignal("");
  const pick = () => size() || (sizesFor(p()!.cat).length > 1 ? "M" : "One size");
  return (
    <Show when={p()} fallback={<div class="wrap page"><h1 class="h-md">Piece not found.</h1><a class="btn" href="/shop" onClick={go}>Back to shop</a></div>}>
      <div class="wrap page">
        <p class="mut crumbs"><a href="/shop" onClick={go}>Shop</a> / <a href={`/categories/${p()!.cat}`} onClick={go}>{catName(p()!.cat)}</a></p>
        <div class="pd">
          <div class="tile stage" style={{ "--a": p()!.hex, "--b": p()!.fg }} data-r><span class="tn">{p()!.name}</span></div>
          <div class="buy" data-r>
            <h1 class="h-md">{p()!.name}</h1>
            <p class="price">{peso(p()!.price)}</p>
            <p class="mut">{p()!.blurb}</p>
            <fieldset class="sizes"><legend>Size</legend>
              <For each={sizesFor(p()!.cat)}>{(s: string) => (<button class={pick() === s ? "sz on" : "sz"} aria-pressed={pick() === s ? "true" : "false"} onClick={() => setSize(s)}>{s}</button>)}</For>
            </fieldset>
            <div class="acts">
              <button class="btn solid mag" disabled={p()!.soldOut} onClick={() => add(p()!.id, pick())}>{p()!.soldOut ? "Sold out" : "Add to bag"}</button>
              <button class="btn mag" disabled={p()!.soldOut} onClick={() => orderNow(p()!.id, pick())}>Order now</button>
              <button class="btn" onClick={() => toggleWish(p()!.id)} aria-pressed={wish().includes(p()!.id) ? "true" : "false"}>{wish().includes(p()!.id) ? "Saved" : "Save"}</button>
            </div>
            <details><summary>Fit and fabric</summary><p class="mut">Boxy cut. If you are between sizes, size down. Pre-washed 260 gsm cotton.</p></details>
            <details><summary>Delivery and returns</summary><p class="mut">₱150 delivery, free over ₱3,000. Returns within 14 days, unworn with tags.</p></details>
          </div>
        </div>
        <div class="head rowsec"><h2>More {catName(p()!.cat)}</h2></div>
        <div class="grid"><For each={products.filter((x) => x.cat === p()!.cat && x.id !== p()!.id).slice(0, 4)}>{(x: any) => <Card p={x} />}</For></div>
      </div>
    </Show>
  );
}
