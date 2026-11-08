import { createSignal, For, Show } from "cajoa";
import { Icon } from "../components/Icon";
import { peso } from "../data";
import { go, nav, orders, signOut, updateUser, user } from "../state";

const KEY = "dna.acct";
const def = { phone: "", size: "M", pay: "cod", addrs: [] as any[], notif: { orders: true, drops: true, promos: false, stock: true, news: false } as Record<string, boolean> };
const load = () => { try { return { ...def, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return def; } };
const tabs = [["profile", "user", "Profile"], ["addr", "pin", "Addresses"], ["orders", "box", "Orders"], ["notif", "bell", "Alerts"], ["sec", "lock", "Security"]];
const notifs = [["orders", "Order updates"], ["drops", "New drops"], ["promos", "Vouchers and sales"], ["stock", "Back in stock"], ["news", "Newsletter"]];
const pays = [["cod", "Cash"], ["gcash", "GCash"], ["card", "Card"]];
const sizes = ["XS", "S", "M", "L", "XL"];
const input = (set: (v: string) => void) => (e: Event) => set((e.target as HTMLInputElement).value);

export function Account() {
  const [a, setA] = createSignal(load());
  const patch = (p: any) => { const n = { ...a(), ...p }; setA(n); try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {} };
  const [tab, setTab] = createSignal("profile");
  const [name, setName] = createSignal(user()?.name ?? "");
  const [email, setEmail] = createSignal(user()?.email ?? "");
  const [phone, setPhone] = createSignal(a().phone);
  const [saved, setSaved] = createSignal("");
  const [err, setErr] = createSignal("");
  const [lab, setLab] = createSignal("");
  const [line, setLine] = createSignal("");
  const [city, setCity] = createSignal("");
  const [cur, setCur] = createSignal("");
  const [np, setNp] = createSignal("");
  const [cp, setCp] = createSignal("");
  const [ask, setAsk] = createSignal(false);
  const flash = (m: string) => { setSaved(m); setTimeout(() => setSaved(""), 2200); };

  const saveProfile = (e: Event) => {
    e.preventDefault();
    if (!name().trim()) return setErr("Enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(email())) return setErr("Enter a valid email.");
    setErr(""); updateUser({ name: name().trim(), email: email().trim() }); patch({ phone: phone() }); flash("Saved");
  };
  const addAddr = (e: Event) => {
    e.preventDefault();
    if (!line().trim() || !city().trim()) return setErr("Enter the street and city.");
    setErr(""); patch({ addrs: [...a().addrs, { id: Date.now(), label: lab().trim() || "Home", line: line().trim(), city: city().trim(), def: a().addrs.length === 0 }] });
    setLab(""); setLine(""); setCity("");
  };
  const savePw = (e: Event) => {
    e.preventDefault();
    if (!cur()) return setErr("Enter your current password.");
    if (np().length < 8) return setErr("Use at least 8 characters.");
    if (np() !== cp()) return setErr("Passwords do not match.");
    setErr(""); setCur(""); setNp(""); setCp(""); flash("Password updated");
  };
  const wipe = () => { Object.keys(localStorage).filter((k) => k.startsWith("dna.")).forEach((k) => localStorage.removeItem(k)); signOut(); nav("/", true); location.reload(); };

  return (
    <div class="wrap page">
      <Show when={user()} fallback={<div class="empty"><span class="ei"><Icon n="user" s={28} /></span><h2>Sign in</h2><a class="btn solid" href="/login" onClick={go}>Continue</a></div>}>
        <div class="ahd"><span class="av">{(user()!.name[0] ?? "?").toUpperCase()}</span><div><h1 class="h-md">{user()!.name}</h1><p class="mut">{user()!.email}</p></div></div>
        <div class="acc">
          <nav class="side" aria-label="Account sections">
            <For each={tabs}>{(t: string[]) => (<button class={tab() === t[0] ? "on" : ""} aria-current={tab() === t[0] ? "page" : "false"} onClick={() => { setTab(t[0]); setErr(""); }}><Icon n={t[1]} s={18} />{t[2]}</button>)}</For>
          </nav>
          <section class="panel" aria-live="polite">
            <Show when={tab() === "profile"}>
              <form class="fs" onSubmit={saveProfile} noValidate>
                <h2>Profile</h2>
                <div class="fld"><label for="an">Name</label><input id="an" value={name} onInput={input(setName)} autocomplete="name" /></div>
                <div class="fld"><label for="ae">Email</label><input id="ae" type="email" value={email} onInput={input(setEmail)} autocomplete="email" /></div>
                <div class="fld"><label for="ap">Phone</label><input id="ap" type="tel" inputmode="tel" placeholder="09XX XXX XXXX" value={phone} onInput={input(setPhone)} autocomplete="tel" /></div>
                <div class="fld"><span class="lbl">Default size</span><div class="seg"><For each={sizes}>{(z: string) => (<button type="button" class={a().size === z ? "on" : ""} onClick={() => patch({ size: z })}>{z}</button>)}</For></div></div>
                <div class="fld"><span class="lbl">Payment</span><div class="seg"><For each={pays}>{(z: string[]) => (<button type="button" class={a().pay === z[0] ? "on" : ""} onClick={() => patch({ pay: z[0] })}>{z[1]}</button>)}</For></div></div>
                <p class="err" role="alert">{err()}</p>
                <button class="btn solid" type="submit">{saved() ? <Icon n="check" s={18} /> : ""}{saved() || "Save"}</button>
              </form>
            </Show>
            <Show when={tab() === "addr"}>
              <h2>Addresses</h2>
              <Show when={a().addrs.length} fallback={<p class="mut">No saved addresses.</p>}>
                <ul class="rows"><For each={a().addrs}>{(d: any) => (
                  <li><span class="vi"><Icon n="pin" /></span><div><b>{d.label}</b>{d.def ? <span class="chip">Default</span> : ""}<p class="mut sm">{d.line}, {d.city}</p></div>
                    <Show when={!d.def}><button class="icon-btn" aria-label="Make default" onClick={() => patch({ addrs: a().addrs.map((x: any) => ({ ...x, def: x.id === d.id })) })}><Icon n="check" s={18} /></button></Show>
                    <button class="icon-btn" aria-label="Delete address" onClick={() => patch({ addrs: a().addrs.filter((x: any) => x.id !== d.id) })}><Icon n="trash" s={18} /></button></li>)}</For></ul>
              </Show>
              <form class="fs" onSubmit={addAddr} noValidate>
                <div class="two"><div class="fld"><label for="al">Label</label><input id="al" placeholder="Home" value={lab} onInput={input(setLab)} /></div><div class="fld"><label for="ac">City</label><input id="ac" value={city} onInput={input(setCity)} autocomplete="address-level2" /></div></div>
                <div class="fld"><label for="as">Street</label><input id="as" value={line} onInput={input(setLine)} autocomplete="street-address" /></div>
                <p class="err" role="alert">{err()}</p>
                <button class="btn" type="submit"><Icon n="plus" s={18} />Add</button>
              </form>
            </Show>
            <Show when={tab() === "orders"}>
              <h2>Orders</h2>
              <Show when={orders().length} fallback={<div class="empty flat"><span class="ei"><Icon n="box" s={28} /></span><a class="btn" href="/shop" onClick={go}>Shop</a></div>}>
                <ul class="rows"><For each={orders()}>{(o: any) => (
                  <li><span class="vi"><Icon n="box" /></span><div><b>{o.id}</b><span class="chip">{o.status}</span><p class="mut sm">{new Date(o.date).toLocaleDateString("en-PH")} · {o.lines.reduce((n: number, l: any) => n + l.qty, 0)} items</p></div><b>{peso(o.total)}</b></li>)}</For></ul>
              </Show>
            </Show>
            <Show when={tab() === "notif"}>
              <h2>Alerts</h2>
              <ul class="rows"><For each={notifs}>{(n: string[]) => (
                <li><div><b>{n[1]}</b></div><button class={a().notif[n[0]] ? "sw on" : "sw"} role="switch" aria-checked={a().notif[n[0]] ? "true" : "false"} aria-label={n[1]} onClick={() => patch({ notif: { ...a().notif, [n[0]]: !a().notif[n[0]] } })}><i /></button></li>)}</For></ul>
            </Show>
            <Show when={tab() === "sec"}>
              <form class="fs" onSubmit={savePw} noValidate>
                <h2>Password</h2>
                <div class="fld"><label for="p0">Current</label><input id="p0" type="password" autocomplete="current-password" value={cur} onInput={input(setCur)} /></div>
                <div class="two"><div class="fld"><label for="p1">New</label><input id="p1" type="password" autocomplete="new-password" value={np} onInput={input(setNp)} /></div><div class="fld"><label for="p2">Confirm</label><input id="p2" type="password" autocomplete="new-password" value={cp} onInput={input(setCp)} /></div></div>
                <p class="err" role="alert">{err()}</p>
                <button class="btn solid" type="submit">{saved() ? <Icon n="check" s={18} /> : ""}{saved() || "Update"}</button>
              </form>
              <ul class="rows">
                <li><span class="vi"><Icon n="out" /></span><div><b>Sign out</b></div><button class="btn" onClick={() => { signOut(); nav("/", true); }}>Sign out</button></li>
                <li class="danger"><span class="vi"><Icon n="trash" /></span><div><b>Delete account</b><p class="mut sm">Removes saved data on this device.</p></div>
                  <Show when={ask()} fallback={<button class="btn" onClick={() => setAsk(true)}>Delete</button>}><button class="btn solid red" onClick={wipe}>Confirm</button></Show></li>
              </ul>
            </Show>
          </section>
        </div>
      </Show>
    </div>
  );
}
