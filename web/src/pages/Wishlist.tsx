import { For, Show } from "cajoa";
import { Card } from "../components/Card";
import { products } from "../data";
import { go, wish } from "../state";

export function Wishlist() {
  const list = () => products.filter((p) => wish().includes(p.id));
  return (
    <div class="wrap page">
      <h1 class="h-md">Saved</h1>
      <Show when={list().length} fallback={<p class="mut">Nothing saved yet. Tap the heart on any piece. <a href="/shop" onClick={go}>Browse the shop</a></p>}>
        <div class="grid"><For each={list()}>{(p: any) => <Card p={p} />}</For></div>
      </Show>
    </div>
  );
}
