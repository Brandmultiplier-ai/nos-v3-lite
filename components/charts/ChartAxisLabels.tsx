interface ChartAxisLabelsProps {
  xLabel: string;
  yLabel: string;
  className?: string;
}

/** Descriptive X/Y axis legend shown below charts. */
export function ChartAxisLabels({ xLabel, yLabel, className = "" }: ChartAxisLabelsProps) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-1 mt-2 ${className}`}
      aria-label={`Chart axes: horizontal ${xLabel}, vertical ${yLabel}`}
    >
      <span className="text-[10px] text-[var(--nos-text-muted)]">
        <span className="font-semibold text-[var(--nos-text-secondary)]">X-axis:</span> {xLabel}
      </span>
      <span className="text-[10px] text-[var(--nos-text-muted)]">
        <span className="font-semibold text-[var(--nos-text-secondary)]">Y-axis:</span> {yLabel}
      </span>
    </div>
  );
}
