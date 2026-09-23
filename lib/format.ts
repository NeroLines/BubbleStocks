export const usd = (n: number) =>
  n >= 1
    ? `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
    : `$${n.toFixed(4)}`;

export const compact = (n: number) => {
  for (const [div, suf] of [[1e9, "B"], [1e6, "M"], [1e3, "K"]] as const) {
    if (n >= div) return `$${(n / div).toFixed(1)}${suf}`;
  }
  return `$${n.toFixed(0)}`;
};

export const pct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`;
