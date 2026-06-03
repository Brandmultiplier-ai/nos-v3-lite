export type DateRangeKey = "7d" | "30d" | "90d";

export function rangeMult(range: DateRangeKey): number {
  return range === "7d" ? 0.23 : range === "30d" ? 1 : 3.1;
}

/** Build a time-series with distinct shape per client seed and range scaling. */
export function buildTrendSeries(
  dates: string[],
  base: number,
  clientSeed: number,
  range: DateRangeKey,
) {
  const mult = rangeMult(range);
  const phase = clientSeed * 1.7;
  const freq = 0.35 + (clientSeed % 5) * 0.18;
  const slope = 6 + (clientSeed % 4) * 4;
  const amp = base * (0.06 + (clientSeed % 3) * 0.03);
  return dates.map((date, i) => ({
    date,
    value: Math.max(
      0,
      Math.round(
        (base +
          i * slope +
          Math.sin((i + phase) * freq) * amp +
          Math.cos(i * (1.1 + clientSeed * 0.15) + phase) * (amp * 0.55)) *
          mult,
      ),
    ),
  }));
}

/** SSR-safe sparkline generator for mock KPI data.
 *
 * Each sequential call to the returned factory function produces a visually
 * distinct 7-point curve by varying the wave phase, frequency, and secondary
 * harmonic — so neighbouring KPI cards never look like copies of each other.
 */
export function createSparklineFactory(
  base: number,
  waveAmplitude = 20,
  jitterRange = 15,
) {
  let seq = 0;
  return () => {
    const seed = seq++;
    const phase = seed * 1.3;               // shift sine phase per call
    const freq = 0.6 + (seed % 5) * 0.15;  // vary frequency per call
    const harmonic = 2.1 + (seed % 3) * 0.4; // secondary harmonic
    const harmAmp = waveAmplitude * (0.25 + (seed % 4) * 0.1);
    return Array.from({ length: 7 }, (_, i) =>
      Math.round(
        base +
        Math.sin((i + phase) * freq) * waveAmplitude +
        Math.cos(i * harmonic + seed * 0.7) * harmAmp +
        ((seed * 7 + i * 11) % jitterRange),
      ),
    );
  };
}
