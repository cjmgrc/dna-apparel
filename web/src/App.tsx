import { createEffect, createSignal, For, onMount, Route, Router, Show } from "cajoa";
import { ThemeToggle } from "./components/ThemeToggle";
import { Categories } from "./pages/Categories";
import { Checkout } from "./pages/Checkout";
import { Discover } from "./pages/Discover";
import { Login } from "./pages/Login";
import { find, peso } from "./data";
import type { Line } from "./state";
import { bag, bagOpen, count, go, notice, setNotice, path, remove, requestOrder, setBagOpen, signOut, subtotal, user } from "./state";

function Tab(props: { href: string; label: string }) {
  const on = () => (props.href === "/" ? path() === "/" : path().startsWith(props.href));
  return (
    <a class={on() ? "nl on" : "nl"} href={props.href} onClick={go} aria-current={on() ? "page" : "false"}>
      {props.label}
    </a>
  );
}

const NotFound = () => (
  <div class="wrap page">
    <h1 class="h-md">Page not found.</h1>
    <a class="btn" href="/" onClick={go}>Back to Discover</a>
  </div>
);

export function App() {
  const [mail, setMail] = createSignal("");
  const [subbed, setSubbed] = createSignal(false);
  let closeBtn: HTMLButtonElement | undefined;
  let last: HTMLElement | null = null;

  createEffect(() => {
    path();
    window.scrollTo(0, 0);
  });

  // Move focus into the bag when it opens, and back to the trigger when it closes.
  createEffect(() => {
    if (bagOpen()) {
      last = document.activeElement as HTMLElement;
      requestAnimationFrame(() => closeBtn?.focus());
    } else {
      last?.focus();
    }
  });

  onMount(() => window.addEventListener("keydown", (e) => e.key === "Escape" && setBagOpen(false)));

  return (
    <div>
      <a class="skip" href="#main">Skip to content</a>
      <header class="top">
        <a class="logo" href="/" onClick={go} aria-label="DNA home">DNA<i /></a>
        <nav aria-label="Main">
          <Tab href="/" label="Discover" />
          <Tab href="/categories" label="Categories" />
        </nav>
        <div class="tools">
          <Show when={user()}>
            <button class="txt" onClick={signOut}>Sign out</button>
          </Show>
          <ThemeToggle />
          <button class="btn" onClick={() => setBagOpen(true)}>Bag ({count()})</button>
        </div>
      </header>

      <main id="main">
        <Router>
          <Route path="/" component={Discover} />
          <Route path="/categories" component={Categories} />
          <Route path="/categories/:slug" component={Categories} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/login" component={Login} />
          <Route path="*" component={NotFound} />
        </Router>
      </main>

      <footer class="foot">
        <div class="wrap fi">
          <form class="sub" onSubmit={(e: Event) => { e.preventDefault(); if (/^\S+@\S+\.\S+$/.test(mail())) setSubbed(true); }} noValidate>
            <label for="sub">Subscribe to our emails</label>
            <div>
              <input id="sub" type="email" autocomplete="email" placeholder="Email" value={mail} onInput={(e) => setMail((e.target as HTMLInputElement).value)} />
              <button class="btn" type="submit">Subscribe</button>
            </div>
            <p class="mut" aria-live="polite">{subbed() ? "Thanks for subscribing." : ""}</p>
          </form>
          <p class="mut">© 2026 DNA Apparel. Frontend demo: sign-in and orders are simulated.</p>
        </div>
      </footer>

      <div class={notice() ? "toast on" : "toast"} role="status">
        <p><b>Item added to your cart</b></p>
        <p class="mut">{notice() ? find(notice()!)!.name : ""}</p>
        <div class="tb">
          <button class="btn" onClick={() => { setNotice(null); setBagOpen(true); }}>View cart</button>
          <button class="btn accent" onClick={requestOrder}>Check out</button>
          <button class="txt" onClick={() => setNotice(null)}>Continue shopping</button>
        </div>
      </div>

      <div class={bagOpen() ? "scrim on" : "scrim"} onClick={() => setBagOpen(false)} />
      <aside class={bagOpen() ? "drawer on" : "drawer"} role="dialog" aria-label="Shopping bag">
        <div class="dh">
          <h2>Your bag</h2>
          <button class="txt" ref={(el: HTMLButtonElement) => (closeBtn = el)} onClick={() => setBagOpen(false)}>Close</button>
        </div>
        <Show when={count() > 0} fallback={<p class="mut">Your bag is empty. Add a piece from Discover.</p>}>
          <ul class="lines">
            <For each={bag()}>
              {(l: Line) => (
                <li>
                  <span>{find(l.id)!.name} ×{l.qty}</span>
                  <span>{peso(find(l.id)!.price * l.qty)}</span>
                  <button class="txt" onClick={() => remove(l.id)} aria-label={`Remove ${find(l.id)!.name}`}>Remove</button>
                </li>
              )}
            </For>
          </ul>
          <div class="df">
            <p><span>Subtotal</span><b>{peso(subtotal())}</b></p>
            <button class="btn accent" onClick={requestOrder}>Order</button>
          </div>
        </Show>
      </aside>
    </div>
  );
}
