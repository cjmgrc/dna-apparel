import { createSignal, onMount, Show } from "cajoa";
import { nav, pending, setPending, signIn, user } from "../state";

type Errors = { name?: string; email?: string; password?: string };

export function Login() {
  const [mode, setMode] = createSignal<"in" | "up">("in");
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [errors, setErrors] = createSignal<Errors>({});
  const [busy, setBusy] = createSignal(false);

  onMount(() => {
    if (user()) nav("/", true);
  });

  const submit = (e: Event) => {
    e.preventDefault();
    const errs: Errors = {};
    if (mode() === "up" && name().trim().length < 2) errs.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(email())) errs.email = "Enter an email like you@example.com.";
    if (password().length < 8) errs.password = "Use at least 8 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    // Replace this timeout with your auth API call.
    setTimeout(() => {
      signIn({ name: mode() === "up" ? name().trim() : email().split("@")[0], email: email() });
      const to = pending() ?? "/";
      setPending(null);
      setBusy(false);
      nav(to, true);
    }, 600);
  };

  return (
    <div class="wrap page">
      <h1 class="h-md">{mode() === "in" ? "Sign in to order." : "Create an account to order."}</h1>
      <Show when={pending()}>
        <p class="note">Your bag is saved. Sign in and we will take you straight to checkout.</p>
      </Show>

      <div class="seg" role="group" aria-label="Account">
        <button class={mode() === "in" ? "on" : ""} aria-pressed={mode() === "in" ? "true" : "false"} onClick={() => setMode("in")}>
          Sign in
        </button>
        <button class={mode() === "up" ? "on" : ""} aria-pressed={mode() === "up" ? "true" : "false"} onClick={() => setMode("up")}>
          Create account
        </button>
      </div>

      <form class="form" onSubmit={submit} noValidate>
        <Show when={mode() === "up"}>
          <div class="fld">
            <label for="name">Full name</label>
            <input id="name" type="text" autocomplete="name" value={name} onInput={(e) => setName((e.target as HTMLInputElement).value)} aria-invalid={errors().name ? "true" : "false"} aria-describedby="e-name" />
            <p class="err" id="e-name">{errors().name ?? ""}</p>
          </div>
        </Show>
        <div class="fld">
          <label for="email">Email</label>
          <input id="email" type="email" autocomplete="email" value={email} onInput={(e) => setEmail((e.target as HTMLInputElement).value)} aria-invalid={errors().email ? "true" : "false"} aria-describedby="e-email" />
          <p class="err" id="e-email">{errors().email ?? ""}</p>
        </div>
        <div class="fld">
          <label for="password">Password</label>
          <input id="password" type="password" autocomplete={mode() === "in" ? "current-password" : "new-password"} value={password} onInput={(e) => setPassword((e.target as HTMLInputElement).value)} aria-invalid={errors().password ? "true" : "false"} aria-describedby="e-password" />
          <p class="err" id="e-password">{errors().password ?? ""}</p>
        </div>
        <button class="btn accent" type="submit" disabled={busy()}>
          {busy() ? "One moment…" : mode() === "in" ? "Sign in and continue" : "Create account and continue"}
        </button>
      </form>
    </div>
  );
}
