"use client";

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string; dataKey: string }[];
  label?: string;
  prefix?: string;
  suffix?: string;
  formatValue?: (v: number) => string;
}

function fmt(v: number, prefix = "", suffix = "") {
  if (v >= 1_000_000) return `${prefix}${(v / 1_000_000).toFixed(1)}M${suffix}`;
  if (v >= 1_000) return `${prefix}${(v / 1_000).toFixed(0)}k${suffix}`;
  return `${prefix}${v.toLocaleString()}${suffix}`;
}

export function CustomTooltip({ active, payload, label, prefix = "", suffix = "", formatValue }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--nos-bg-overlay)] px-4 py-3 shadow-2xl text-xs min-w-[140px]">
      {label && <p className="text-[var(--nos-text-muted)] mb-2 font-medium">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-[var(--nos-text-secondary)] capitalize">
              {p.name}
            </span>
          </div>
          <span className="font-semibold text-[var(--nos-text-primary)]">
            {formatValue ? formatValue(p.value) : fmt(p.value, prefix, suffix)}
          </span>
        </div>
      ))}
    </div>
  );
}
