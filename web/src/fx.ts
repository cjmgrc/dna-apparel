// Scroll reveal only. Skipped when the person prefers reduced motion.
export function initFx() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) { document.documentElement.classList.add("calm"); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.08 });
  const scan = () => document.querySelectorAll("[data-r]:not(.in)").forEach((n) => io.observe(n));
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  scan();
}
