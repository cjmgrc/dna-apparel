import { createEffect, createSignal, For, onMount, Route, Router, Show } from "cajoa";
import { Icon } from "./components/Icon";
import { ThemeToggle } from "./components/ThemeToggle";
import { Categories } from "./pages/Categories";
import { Checkout } from "./pages/Checkout";
import { Discover } from "./pages/Discover";
import { Info } from "./pages/Info";
import { Login } from "./pages/Login";
import { Product } from "./pages/Product";
import { Wishlist } from "./pages/Wishlist";
import { FREE_SHIPPING, categories, find, peso } from "./data";
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
  const [menu, setMenu] = createSignal(false);
  const [codeMsg, setCodeMsg] = createSignal("");
  let closeBtn: HTMLButtonElement | undefined;
  let last: HTMLElement | null = null;
  const base = (l: Line) => find(l.id.split("|")[0])!;

  createEffect(() => { path(); window.scrollTo(0, 0); setMenu(false); });
  createEffect(() => {
    if (bagOpen()) { last = document.activeElement as HTMLElement; requestAnimationFrame(() => closeBtn?.focus()); } else { last?.focus(); }
  });
  onMount(() => {
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") { setBagOpen(false); setMenu(false); } });
    document.addEventListener("click", (e) => { if (!(e.target as Element).closest(".dd")) setMenu(false); });
  });

  return (
    <div>
      <a class="skip" href="#main">Skip to content</a>
      <header class="hdr">
        <div class="hr wrap">
          <a class="logo" href="/" onClick={go} aria-label="DNA home">DNA<i /></a>
          <nav class="hn" aria-label="Main">
            <Tab href="/" label="Home" />
            <div class="dd">
              <button class={path().startsWith("/categories") || path() === "/shop" ? "nl dd-b on" : "nl dd-b"} aria-haspopup="true" aria-expanded={menu() ? "true" : "false"} onClick={() => setMenu(!menu())}>Categories<Icon n="chev" s={16} /></button>
              <div class={menu() ? "menu on" : "menu"} role="menu">
                <a role="menuitem" href="/shop" onClick={go}><Icon n="grid" s={18} />All</a>
                <For each={categories}>{(c: any) => (<a role="menuitem" href={`/categories/${c.id}`} onClick={go}><Icon n={c.id} s={18} />{c.name}</a>)}</For>
              </div>
            </div>
          </nav>
          <form class="search" role="search" onSubmit={(e: Event) => { e.preventDefault(); nav("/shop"); }}>
            <Icon n="search" s={18} />
            <label class="sr" for="hq">Search</label>
            <input id="hq" type="search" placeholder="Search" value={query} onInput={(e) => setQuery((e.target as HTMLInputElement).value)} />
          </form>
          <a class="ico" href="/wishlist" onClick={go} aria-label={`Saved, ${wish().length}`}><Icon n="heart" /><b>{wish().length}</b></a>
          <button class="ico" onClick={() => setBagOpen(true)} aria-label={`Bag, ${count()} items`}><Icon n="bag" /><b>{count()}</b></button>
          <Show when={user()} fallback={<a class="ico hide-s" href="/login" onClick={go} aria-label="Sign in"><Icon n="user" /></a>}><button class="ico hide-s" onClick={signOut} aria-label="Sign out"><Icon n="out" /></button></Show>
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
            <label for="sub">Drop alerts</label>
            <div>
              <input id="sub" type="email" autocomplete="email" placeholder="Email" value={mail} onInput={(e) => setMail((e.target as HTMLInputElement).value)} />
              <button class="btn solid" type="submit" aria-label="Subscribe"><Icon n={subbed() ? "check" : "mail"} s={18} /></button>
            </div>
          </form>
          <p class="mut">© 2026 DNA Apparel · Demo store · Code DNA10</p>
        </div>
        <p class="giant" aria-hidden="true">DNA</p>
      </footer>

      <div class={notice() ? "toast on" : "toast"} role="status">
        <p><b>Added</b> <span class="mut">{notice() ? find(notice()!)!.name : ""}</span></p>
        <div class="tb">
          <button class="btn" onClick={() => { setNotice(null); setBagOpen(true); }} aria-label="View bag"><Icon n="bag" s={18} />Bag</button>
          <button class="btn solid" onClick={requestOrder}>Checkout<Icon n="arrow" s={18} /></button>
          <button class="btn" onClick={() => setNotice(null)} aria-label="Dismiss"><Icon n="close" s={18} /></button>
        </div>
      </div>

      <nav class="bn" aria-label="Quick">
        <a href="/" onClick={go} aria-label="Home"><Icon n="home" s={24} /></a><a href="/shop" onClick={go} aria-label="Shop"><Icon n="grid" s={24} /></a><a href="/wishlist" onClick={go} aria-label="Saved"><Icon n="heart" s={24} /><b>{wish().length}</b></a><button onClick={() => setBagOpen(true)} aria-label="Bag"><Icon n="bag" s={24} /><b>{count()}</b></button><a href="/login" onClick={go} aria-label="Account"><Icon n="user" s={24} /></a>
      </nav>
      <div class={bagOpen() ? "scrim on" : "scrim"} onClick={() => setBagOpen(false)} />
      <aside class={bagOpen() ? "drawer on" : "drawer"} role="dialog" aria-label="Shopping bag">
        <div class="dh"><h2>Bag</h2><button class="icon-btn" ref={(el: HTMLButtonElement) => (closeBtn = el)} onClick={() => setBagOpen(false)} aria-label="Close"><Icon n="close" /></button></div>
        <Show when={count() > 0} fallback={<p class="mut">Empty.</p>}>
          <p class="mt"><Icon n="truck" s={18} />{gross() >= FREE_SHIPPING ? "Free delivery" : `${peso(FREE_SHIPPING - gross())} to free delivery`}</p>
          <div class="meter" aria-hidden="true"><i style={{ transform: `scaleX(${Math.min(1, gross() / FREE_SHIPPING)})` }} /></div>
          <ul class="lines">
            <For each={bag()}>
              {(l: Line) => (
                <li>
                  <span>{base(l).name}<small>{l.id.split("|")[1]}</small></span>
                  <span class="qty"><button onClick={() => setQty(l.id, -1)} aria-label="Fewer"><Icon n="minus" s={16} /></button>{l.qty}<button onClick={() => setQty(l.id, 1)} aria-label="More"><Icon n="plus" s={16} /></button></span>
                  <b>{peso(base(l).price * l.qty)}</b>
                  <button class="txt" onClick={() => remove(l.id)} aria-label={`Remove ${base(l).name}`}><Icon n="trash" s={16} /></button>
                </li>
              )}
            </For>
          </ul>
          <form class="promo" onSubmit={(e: Event) => { e.preventDefault(); setCodeMsg(applyPromo(code()) ? "-10%" : "Invalid code"); }}>
            <Icon n="ticket" s={18} /><label class="sr" for="pc">Promo code</label>
            <input id="pc" placeholder="Promo code" value={code} onInput={(e) => setCode((e.target as HTMLInputElement).value)} />
            <button class="btn" type="submit" aria-label="Apply code"><Icon n="check" /></button>
          </form>
          <p class="mut sm" aria-live="polite">{promo() ? "-10%" : codeMsg()}</p>
          <div class="df">
            <p><span class="mut">Total</span><b>{peso(subtotal())}</b></p>
            <button class="btn solid" onClick={requestOrder}>Checkout<Icon n="arrow" s={18} /></button>
          </div>
        </Show>
      </aside>
    </div>
  );
}
