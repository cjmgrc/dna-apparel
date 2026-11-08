import { createEffect, createSignal, For, onMount, Route, Router, Show } from "cajoa";
import { ThemeToggle } from "./components/ThemeToggle";
import { Categories } from "./pages/Categories";
import { Checkout } from "./pages/Checkout";
import { Discover } from "./pages/Discover";
import { Info } from "./pages/Info";
import { Login } from "./pages/Login";
import { Product } from "./pages/Product";
import { Wishlist } from "./pages/Wishlist";
import { FREE_SHIPPING, find, peso } from "./data";
import type { Line } from "./state";
import { applyPromo, bag, bagOpen, count, go, gross, nav, setQuery, query, notice, setNotice, path, promo, remove, requestOrder, setBagOpen, setQty, signOut, subtotal, user, wish } from "./state";

function Tab(props: { href: string; label: string }) {
  const on = () => (props.href === "/" ? path() === "/" : path().startsWith(props.href));
  return <a class={on() ? "nl on" : "nl"} href={props.href} onClick={go} aria-current={on() ? "page" : "false"}>{props.label}</a>;
}

const NotFound = () => (
  <div class="wrap page"><h1 class="h-md">404. Off the grid.</h1><a class="btn" href="/" onClick={go}>Back to Discover</a></div>
);

export function App() {
  const [mail, setMail] = createSignal("");
  const [subbed, setSubbed] = createSignal(false);
  const [code, setCode] = createSignal("");
  const [codeMsg, setCodeMsg] = createSignal("");
  let closeBtn: HTMLButtonElement | undefined;
  let last: HTMLElement | null = null;
  const base = (l: Line) => find(l.id.split("|")[0])!;

  createEffect(() => { path(); window.scrollTo(0, 0); });
  createEffect(() => {
    if (bagOpen()) { last = document.activeElement as HTMLElement; requestAnimationFrame(() => closeBtn?.focus()); } else { last?.focus(); }
  });
  onMount(() => window.addEventListener("keydown", (e) => e.key === "Escape" && setBagOpen(false)));

  return (
    <div>
      <a class="skip" href="#main">Skip to content</a>
      <header class="hdr">
        <div class="hr wrap">
          <a class="logo" href="/" onClick={go} aria-label="DNA home">DNA<i /></a>
          <nav class="hn" aria-label="Main">
            <Tab href="/" label="Home" /><Tab href="/shop" label="Shop" /><Tab href="/categories/tees" label="Tees" /><Tab href="/categories/hoodies" label="Hoodies" /><Tab href="/categories/outerwear" label="Outerwear" />
          </nav>
          <form class="search" role="search" onSubmit={(e: Event) => { e.preventDefault(); nav("/shop"); }}>
            <label class="sr" for="hq">Search DNA Apparel</label>
            <input id="hq" type="search" placeholder="Search DNA Apparel" value={query} onInput={(e) => setQuery((e.target as HTMLInputElement).value)} />
            <button class="btn solid" type="submit" aria-label="Search">Search</button>
          </form>
          <a class="ico" href="/wishlist" onClick={go} aria-label={`Saved, ${wish().length}`}>Saved<b>{wish().length}</b></a>
          <button class="ico" onClick={() => setBagOpen(true)} aria-label={`Bag, ${count()} items`}>Bag<b>{count()}</b></button>
          <Show when={user()} fallback={<a class="ico hide-s" href="/login" onClick={go}>Sign in</a>}><button class="ico hide-s" onClick={signOut}>Sign out</button></Show>
          <ThemeToggle />
        </div>
      </header>

      <main id="main">
        <Router>
          <Route path="/" component={Discover} />
          <Route path="/shop" component={Categories} />
          <Route path="/categories" component={Categories} />
          <Route path="/categories/:slug" component={Categories} />
          <Route path="/product/:slug" component={Product} />
          <Route path="/wishlist" component={Wishlist} />
          <Route path="/info" component={Info} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/login" component={Login} />
          <Route path="*" component={NotFound} />
        </Router>
      </main>

      <footer class="foot">
        <div class="wrap fi">
          <form class="sub" onSubmit={(e: Event) => { e.preventDefault(); if (/^\S+@\S+\.\S+$/.test(mail())) setSubbed(true); }} noValidate>
            <label for="sub">Get drop alerts</label>
            <div>
              <input id="sub" type="email" autocomplete="email" placeholder="Email" value={mail} onInput={(e) => setMail((e.target as HTMLInputElement).value)} />
              <button class="btn solid" type="submit">Subscribe</button>
            </div>
            <p class="mut" aria-live="polite">{subbed() ? "You are on the list." : ""}</p>
          </form>
          <p class="mut">© 2026 DNA Apparel. Frontend demo: sign-in and orders are simulated. Try code DNA10.</p>
        </div>
        <p class="giant" aria-hidden="true">DNA</p>
      </footer>

      <div class={notice() ? "toast on" : "toast"} role="status">
        <p><b>Added to your bag</b></p>
        <p class="mut">{notice() ? find(notice()!)!.name : ""}</p>
        <div class="tb">
          <button class="btn" onClick={() => { setNotice(null); setBagOpen(true); }}>View bag</button>
          <button class="btn solid" onClick={requestOrder}>Check out</button>
          <button class="txt" onClick={() => setNotice(null)}>Continue shopping</button>
        </div>
      </div>

      <nav class="bn" aria-label="Quick">
        <a href="/" onClick={go}>Home</a><a href="/shop" onClick={go}>Shop</a><a href="/wishlist" onClick={go}>Saved {wish().length}</a><button onClick={() => setBagOpen(true)}>Bag {count()}</button><a href="/login" onClick={go}>Me</a>
      </nav>
      <div class={bagOpen() ? "scrim on" : "scrim"} onClick={() => setBagOpen(false)} />
      <aside class={bagOpen() ? "drawer on" : "drawer"} role="dialog" aria-label="Shopping bag">
        <div class="dh"><h2>Your bag</h2><button class="txt" ref={(el: HTMLButtonElement) => (closeBtn = el)} onClick={() => setBagOpen(false)}>Close</button></div>
        <Show when={count() > 0} fallback={<p class="mut">Your bag is empty. Add a piece from Discover.</p>}>
          <p class="mut">{gross() >= FREE_SHIPPING ? "Free delivery unlocked." : `${peso(FREE_SHIPPING - gross())} to free delivery`}</p>
          <div class="meter" aria-hidden="true"><i style={{ transform: `scaleX(${Math.min(1, gross() / FREE_SHIPPING)})` }} /></div>
          <ul class="lines">
            <For each={bag()}>
              {(l: Line) => (
                <li>
                  <span>{base(l).name}<small class="mut"> {l.id.split("|")[1]}</small></span>
                  <span class="qty"><button onClick={() => setQty(l.id, -1)} aria-label="Fewer">−</button>{l.qty}<button onClick={() => setQty(l.id, 1)} aria-label="More">+</button></span>
                  <span>{peso(base(l).price * l.qty)}</span>
                  <button class="txt" onClick={() => remove(l.id)} aria-label={`Remove ${base(l).name}`}>Remove</button>
                </li>
              )}
            </For>
          </ul>
          <form class="promo" onSubmit={(e: Event) => { e.preventDefault(); setCodeMsg(applyPromo(code()) ? "10% off applied." : "That code is not valid."); }}>
            <label class="sr" for="pc">Promo code</label>
            <input id="pc" placeholder="Promo code" value={code} onInput={(e) => setCode((e.target as HTMLInputElement).value)} />
            <button class="btn" type="submit">Apply</button>
          </form>
          <p class="mut" aria-live="polite">{promo() ? "10% off applied." : codeMsg()}</p>
          <div class="df">
            <p><span>Subtotal</span><b>{peso(subtotal())}</b></p>
            <button class="btn solid" onClick={requestOrder}>Order</button>
          </div>
        </Show>
      </aside>
    </div>
  );
}
