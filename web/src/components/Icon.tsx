const P: Record<string, string> = {
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  heart: "M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z",
  bag: "M6 7h12l1 13H5L6 7zM9 7a3 3 0 0 1 6 0",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  out: "M9 4H5v16h4M16 8l4 4-4 4M20 12H9",
  home: "M3 11l9-8 9 8M5 10v10h14V10",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  truck: "M2 6h12v10H2zM14 10h4l3 3v3h-7M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM19 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
  tag: "M3 12V4h8l10 10-8 8L3 12zM7.5 8.5h.01",
  ret: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  close: "M6 6l12 12M18 6L6 18",
  check: "M5 12l5 5 9-10",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7l1-8z",
  next: "M9 6l6 6-6 6",
  arrow: "M5 12h14M13 6l6 6-6 6",
  mail: "M3 5h18v14H3zM3 7l9 6 9-6",
  tees: "M8 3L3 6l2 4 3-1v11h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0z",
  hoodies: "M6 8l-3 3 2 4 2-1v7h10v-7l2 1 2-4-3-3-3 2a3 3 0 0 1-6 0L6 8z",
  outerwear: "M9 3L3 7v13h6V10l3 3 3-3v10h6V7l-6-4-3 4-3-4z",
  bottoms: "M7 3h10l1 18h-5l-1-9-1 9H6L7 3z",
  headwear: "M4 16a8 8 0 0 1 16 0zM2 16h20v3H2z",
  bags: "M5 8h14l1 13H4L5 8zM9 8V6a3 3 0 0 1 6 0v2",
  chev: "M6 9l6 6 6-6",
  sliders: "M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4",
  pin: "M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  box: "M3 7l9-4 9 4v10l-9 4-9-4V7zM3 7l9 4 9-4M12 11v10",
  bell: "M6 16v-5a6 6 0 0 1 12 0v5l2 2H4l2-2zM10 21h4",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  ticket: "M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 1 0-4V6H3v2zM9 6v12",
};
export function Icon(props: { n: string; s?: number }) {
  return (
    <svg class="i" viewBox="0 0 24 24" width={props.s ?? 20} height={props.s ?? 20} aria-hidden="true">
      <path d={P[props.n] ?? ""} />
    </svg>
  );
}
