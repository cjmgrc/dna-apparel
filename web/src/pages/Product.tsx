import { createSignal, For, Show } from "cajoa";
import { Icon } from "../components/Icon";
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
              <button class="btn solid mag" data-fly="1" disabled={p()!.soldOut} onClick={() => add(p()!.id, pick())}><Icon n="bag" s={18} />{p()!.soldOut ? "Sold out" : "Add"}</button>
              <button class="btn mag" disabled={p()!.soldOut} onClick={() => orderNow(p()!.id, pick())}>Buy<Icon n="arrow" s={18} /></button>
              <button data-heart="1" class={wish().includes(p()!.id) ? "heart on" : "heart"} onClick={() => toggleWish(p()!.id)} aria-label="Save" aria-pressed={wish().includes(p()!.id) ? "true" : "false"}><Icon n="heart" s={20} /></button>
            </div>
            <details><summary><span class="vs"><Icon n="tees" s={18} />Fit</span></summary><p class="mut">Boxy cut. Size down between sizes. 260 gsm cotton.</p></details>
            <details><summary><span class="vs"><Icon n="truck" s={18} />Delivery</span></summary><p class="mut">₱150, free over ₱3,000. Returns within 14 days.</p></details>
          </div>
        </div>
        <div class="head rowsec"><h2>More {catName(p()!.cat)}</h2></div>
        <div class="grid"><For each={products.filter((x) => x.cat === p()!.cat && x.id !== p()!.id).slice(0, 4)}>{(x: any) => <Card p={x} />}</For></div>
      </div>
    </Show>
  );
}
