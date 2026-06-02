/** SSR-safe sparkline generator for mock KPI data. */
export function createSparklineFactory(
  base: number,
  wave: (i: number) => number,
  jitterRange = 15,
) {
  let seq = 0;
  return () => {
    const seed = seq++;
    return Array.from({ length: 7 }, (_, i) =>
      Math.round(base + wave(i) + ((seed * 7 + i * 11) % jitterRange)),
    );
  };
}
