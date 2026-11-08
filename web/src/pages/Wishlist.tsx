import { For, Show } from "cajoa";
import { Icon } from "../components/Icon";
import { Card } from "../components/Card";
import { products } from "../data";
import { go, wish } from "../state";

export function Wishlist() {
  const list = () => products.filter((p) => wish().includes(p.id));
  return (
    <div class="wrap page">
      <h1 class="h-md">Saved</h1>
      <Show when={list().length} fallback={<div class="empty"><span class="ei"><Icon n="heart" s={28} /></span><a class="btn solid" href="/shop" onClick={go}>Browse</a></div>}>
        <div class="grid"><For each={list()}>{(p: any) => <Card p={p} />}</For></div>
      </Show>
    </div>
  );
}
