// Motion layer: scroll reveal, fly-to-bag, heart burst. All movement is skipped for reduced-motion.
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
const visible = (el: Element) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
const center = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
const restart = (el: Element | null, cls: string) => { if (!el) return; el.classList.remove(cls); void (el as HTMLElement).offsetWidth; el.classList.add(cls); };

function fly(btn: HTMLElement) {
  const target = [...document.querySelectorAll<HTMLElement>('.hr .ico[aria-label^="Bag"], .bn button[aria-label="Bag"]')].find(visible);
  if (!target) return;
  const s = center(btn), e = center(target);
  const tile = btn.closest(".card,.pd")?.querySelector(".tile") as HTMLElement | null;
  const dot = document.createElement("div");
  dot.className = "fly";
  dot.style.background = tile?.style.getPropertyValue("--a") || "var(--ac)";
  document.body.append(dot);
  const at = (x: number, y: number, k: number) => `translate(${x - 14}px,${y - 14}px) scale(${k})`;
  dot.animate(
    [{ transform: at(s.x, s.y, 1) }, { transform: at((s.x + e.x) / 2, Math.min(s.y, e.y) - 70, 1.15), offset: 0.45 }, { transform: at(e.x, e.y, 0.3), opacity: 0.9 }],
    { duration: 650, easing: "cubic-bezier(.4,0,.2,1)" },
  ).onfinish = () => { dot.remove(); restart(target, "wob"); restart(target.querySelector("b"), "pop"); };
}

function burst(btn: HTMLElement) {
  const c = center(btn);
  for (let i = 0; i < 7; i++) {
    const p = document.createElement("span");
    p.className = "hp";
    p.textContent = "♥";
    document.body.append(p);
    const a = (i / 7) * Math.PI * 2 + Math.random() * 0.6, d = 34 + Math.random() * 26;
    p.animate(
      [{ transform: `translate(${c.x - 7}px,${c.y - 7}px) scale(.4)`, opacity: 1 }, { transform: `translate(${c.x - 7 + Math.cos(a) * d}px,${c.y - 7 + Math.sin(a) * d - 12}px) scale(1)`, opacity: 0 }],
      { duration: 550 + Math.random() * 250, easing: "cubic-bezier(.2,.7,.3,1)" },
    ).onfinish = () => p.remove();
  }
}

function pill(msg: string) {
  document.querySelector(".pill")?.remove();
  const p = document.createElement("div");
  p.className = "pill";
  p.setAttribute("role", "status");
  p.innerHTML = '<svg class="i" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z"/></svg>' + msg;
  document.body.append(p);
  setTimeout(() => p.classList.add("out"), 1500);
  setTimeout(() => p.remove(), 1900);
}

export function initFx() {
  // capture phase: read the pre-click state before the button's own handler toggles it
  document.addEventListener("click", (ev) => {
    const t = ev.target as Element;
    const h = t.closest<HTMLElement>("[data-heart]");
    if (h) { if (h.getAttribute("aria-pressed") !== "true") { pill("Saved"); if (!calm) burst(h); } return; }
    const f = t.closest<HTMLElement>("[data-fly]");
    if (f && !calm) fly(f);
  }, true);

  if (calm) { document.documentElement.classList.add("calm"); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.08 });
  const scan = () => document.querySelectorAll("[data-r]:not(.in)").forEach((n) => io.observe(n));
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  scan();
}
