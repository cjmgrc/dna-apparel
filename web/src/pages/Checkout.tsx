import { createSignal, For, onMount, Show } from "cajoa";
import type { Line } from "../state";
import { FREE_SHIPPING, SHIPPING, find, peso } from "../data";
import { bag, clearBag, count, go, nav, setPending, subtotal, user } from "../state";

export function Checkout() {
  const first = (user()?.name ?? "").split(" ")[0];
  const [orderId, setOrderId] = createSignal<string | null>(null);
  const shipping = () => (subtotal() >= FREE_SHIPPING ? 0 : SHIPPING);

  // Ordering needs an account: send guests to login, then bring them back here.
  onMount(() => {
    if (!user()) {
      setPending("/checkout");
      nav("/login", true);
    }
  });

  const place = (e: Event) => {
    e.preventDefault();
    setOrderId("DNA-" + Math.random().toString(36).slice(2, 8).toUpperCase());
    clearBag();
  };

  return (
    <div class="wrap page">
      <Show when={user()}>
        <Show
          when={orderId()}
          fallback={
            <div>
              <h1 class="h-md">Checkout</h1>
              <Show when={count() === 0}>
                <p class="mut">Your bag is empty.</p>
                <a class="btn" href="/categories" onClick={go}>Browse categories</a>
              </Show>
              <Show when={count() > 0}>
                <div class="co">
                  <form class="form" onSubmit={place}>
                    <div class="fld"><label for="addr">Delivery address</label><input id="addr" type="text" autocomplete="street-address" required /></div>
                    <div class="fld"><label for="city">City</label><input id="city" type="text" autocomplete="address-level2" required /></div>
                    <div class="fld"><label for="tel">Phone</label><input id="tel" type="tel" autocomplete="tel" required /></div>
                    <button class="btn accent" type="submit">Place order</button>
                  </form>
                  <aside class="sum" aria-label="Order summary">
                    <ul class="lines">
                      <For each={bag()}>
                        {(l: Line) => (
                          <li>
                            <span>{find(l.id.split("|")[0])!.name} ×{l.qty}</span>
                            <span>{peso(find(l.id.split("|")[0])!.price * l.qty)}</span>
                          </li>
                        )}
                      </For>
                    </ul>
                    <p class="tot"><span>Delivery</span><span>{shipping() === 0 ? "Free" : peso(shipping())}</span></p>
                    <p class="tot big"><span>Total</span><span>{peso(subtotal() + shipping())}</span></p>
                  </aside>
                </div>
              </Show>
            </div>
          }
        >
          <div>
            <h1 class="h-md">Order placed.</h1>
            <p class="lead">Thanks, {first}. Your order number is <b>{orderId()}</b>.</p>
            <a class="btn" href="/" onClick={go}>Back to Discover</a>
          </div>
        </Show>
      </Show>
    </div>
  );
}
