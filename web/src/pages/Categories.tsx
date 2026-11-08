import { For, Show } from "cajoa";
import { Card } from "../components/Card";
import type { Category, Product } from "../data";
import { categories, products } from "../data";
import { go, path } from "../state";

export function Categories() {
  const slug = () => path().split("/")[2] ?? "";
  const list = () => (slug() ? products.filter((p) => p.cat === slug()) : products);
  const active = () => categories.find((c) => c.id === slug());

  return (
    <div class="wrap page">
      <h1 class="h-md">Categories</h1>
      <ul class="cats">
        <For each={categories}>
          {(c: Category) => (
            <li>
              <a
                class={slug() === c.id ? "line on" : "line"}
                href={`/categories/${c.id}`}
                onClick={go}
                aria-current={slug() === c.id ? "page" : "false"}
              >
                <span class="nm">{c.name}</span>
                <span class="bl mut">{c.blurb}</span>
                <span class="mut">{products.filter((p) => p.cat === c.id).length} pieces</span>
              </a>
            </li>
          )}
        </For>
      </ul>

      <div class="head">
        <h2>{active() ? active()!.name : "Everything"}</h2>
        <Show when={slug()}>
          <a href="/categories" onClick={go}>Show everything</a>
        </Show>
      </div>
      <Show when={list().length === 0}>
        <p class="mut">Nothing here yet. Pick another category above.</p>
      </Show>
      <div class="grid">
        <For each={list()}>{(p: Product) => <Card p={p} />}</For>
      </div>
    </div>
  );
}
