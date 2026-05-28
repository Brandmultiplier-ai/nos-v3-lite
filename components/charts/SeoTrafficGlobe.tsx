"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import { geoOrthographic, geoPath, geoGraticule10, type GeoSphere } from "d3-geo";
import type { CountryRow } from "@/lib/data/types";

const WORLD_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const MAX_DPR = 1.25;
const SPIN_MS = 80; // ~12fps idle spin — smooth enough, much lighter than 60fps
const ISO_NUM_TO_ALPHA2: Record<string, string> = {
  "840": "US", "356": "IN", "124": "CA", "826": "GB",
  "036": "AU", "276": "DE", "702": "SG", "250": "FR",
  "643": "RU", "392": "JP", "554": "NZ",
};

function topoFeatures(topo: {
  transform?: { scale: [number, number]; translate: [number, number] };
  arcs: number[][][];
  objects: { countries: { geometries: { type: string; id?: string | number; arcs: number[][] | number[][][] }[] } };
}): GeoJSON.Feature[] {
  const { transform, arcs: topoArcs, objects } = topo;
  const [sx, sy] = transform?.scale ?? [1, 1];
  const [tx, ty] = transform?.translate ?? [0, 0];

  function decodeArc(arcIdx: number): number[][] {
    const arc = topoArcs[arcIdx < 0 ? ~arcIdx : arcIdx];
    let x = 0, y = 0;
    const pts = arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; });
    return arcIdx < 0 ? pts.reverse() : pts;
  }

  function stitchArcs(rings: number[][]): number[][][] {
    return rings.map((ring) => ring.flatMap((i) => decodeArc(i)));
  }

  return objects.countries.geometries.map((geom) => ({
    type: "Feature" as const,
    id: geom.id,
    properties: { id: geom.id },
    geometry:
      geom.type === "Polygon"
        ? { type: "Polygon" as const, coordinates: stitchArcs(geom.arcs as number[][]) }
        : { type: "MultiPolygon" as const, coordinates: (geom.arcs as number[][][]).map((rings) => stitchArcs(rings)) },
  }));
}

interface SeoTrafficGlobeProps {
  countries: CountryRow[];
  activeCode?: string | null;
  onCountryHover?: (code: string | null) => void;
  onCountrySelect?: (code: string | null) => void;
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function fmtChange(n: number) {
  const abs = Math.abs(n);
  const s = abs >= 1000 ? `${(abs / 1000).toFixed(1)}K` : String(abs);
  return `${n >= 0 ? "+" : "−"}${s}`;
}

export const SeoTrafficGlobe = memo(function SeoTrafficGlobe({
  countries,
  activeCode,
  onCountryHover,
  onCountrySelect,
}: SeoTrafficGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const worldFeaturesRef = useRef<GeoJSON.Feature[]>([]);
  const rotation = useRef<[number, number]>([-20, -20]);
  const isDragging = useRef(false);
  const isVisible = useRef(true);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const hasMoved = useRef(false);
  const spinTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafDrag = useRef<number | null>(null);
  const tooltipRef = useRef<{ country: CountryRow; x: number; y: number } | null>(null);
  const hoverThrottle = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ country: CountryRow; x: number; y: number } | null>(null);

  const countryMapRef = useRef(new Map<string, CountryRow>());
  const maxTrafficRef = useRef(1);

  useEffect(() => {
    tooltipRef.current = tooltip;
  }, [tooltip]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !worldFeaturesRef.current.length) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const size = Math.min(W, H);
    ctx.clearRect(0, 0, W, H);

    const proj = geoOrthographic()
      .rotate([rotation.current[0], rotation.current[1], 0])
      .translate([W / 2, H / 2])
      .scale(size / 2.15)
      .clipAngle(90);

    const path = geoPath(proj, ctx);

    // Sphere fill
    const sphere: GeoSphere = { type: "Sphere" };
    ctx.beginPath();
    path(sphere);
    ctx.fillStyle = "rgba(12,12,20,0.98)";
    ctx.fill();
    ctx.strokeStyle = "rgba(124,127,255,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Light graticule (pre-built, cheaper than geoGraticule().step)
    ctx.beginPath();
    path(geoGraticule10());
    ctx.strokeStyle = "rgba(124,127,255,0.06)";
    ctx.lineWidth = 0.4;
    ctx.stroke();

    const maxTraffic = maxTrafficRef.current;
    const countryMap = countryMapRef.current;

    for (const feature of worldFeaturesRef.current) {
      const numId = String(feature.id).padStart(3, "0");
      const alpha2 = ISO_NUM_TO_ALPHA2[numId];
      const countryData = alpha2 ? countryMap.get(alpha2) : null;

      ctx.beginPath();
      path(feature);

      if (countryData) {
        const t = countryData.traffic / maxTraffic;
        const growing = countryData.trafficChange >= 0;
        ctx.fillStyle = growing
          ? `rgba(52,211,153,${0.15 + t * 0.45})`
          : `rgba(255,68,85,${0.12 + t * 0.35})`;
        ctx.strokeStyle = growing ? "rgba(52,211,153,0.4)" : "rgba(255,68,85,0.35)";
        ctx.lineWidth = 0.6;
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.035)";
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 0.3;
      }

      ctx.fill();
      ctx.stroke();
    }

    // Markers
    for (const c of countries) {
      const projected = proj([c.lon, c.lat]);
      if (!projected) continue;
      const [x, y] = projected;
      const cosAngle =
        Math.cos((c.lat * Math.PI) / 180) *
        Math.cos(((c.lon - -rotation.current[0]) * Math.PI) / 180);
      if (cosAngle < 0.15) continue;

      const growing = c.trafficChange >= 0;
      const r = 3 + (c.traffic / maxTraffic) * 5;
      const isActive = activeCode === c.code;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = growing ? "rgba(52,211,153,0.95)" : "rgba(255,68,85,0.95)";
      ctx.fill();
      if (isActive) {
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }, [countries, activeCode]);

  const startSpin = useCallback(() => {
    if (spinTimer.current) return;
    spinTimer.current = setInterval(() => {
      if (!isVisible.current || isDragging.current || tooltipRef.current) return;
      rotation.current[0] += 0.35;
      draw();
    }, SPIN_MS);
  }, [draw]);

  const stopSpin = useCallback(() => {
    if (spinTimer.current) {
      clearInterval(spinTimer.current);
      spinTimer.current = null;
    }
  }, []);

  // Load map once
  useEffect(() => {
    let cancelled = false;
    fetch(WORLD_URL)
      .then((r) => r.json())
      .then((topo) => {
        if (cancelled) return;
        worldFeaturesRef.current = topoFeatures(topo);
        setLoading(false);
        draw();
        startSpin();
      })
      .catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, [draw, startSpin]);

  // Pause when off-screen or tab hidden
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
        if (entry.isIntersecting) startSpin();
        else stopSpin();
      },
      { threshold: 0.1 }
    );
    io.observe(el);

    const onVis = () => {
      if (document.hidden) stopSpin();
      else if (isVisible.current) startSpin();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      stopSpin();
      if (rafDrag.current) cancelAnimationFrame(rafDrag.current);
    };
  }, [startSpin, stopSpin]);

  // Resize — cap DPR for performance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const size = Math.min(rect.width, 480);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      canvas.style.height = `${size}px`;
      draw();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    return () => observer.disconnect();
  }, [draw]);

  useEffect(() => {
    countryMapRef.current = new Map(countries.map((c) => [c.code, c]));
    maxTrafficRef.current = Math.max(...countries.map((c) => c.traffic), 1);
    draw();
  }, [countries, draw, activeCode]);

  const getHitCountry = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const dpr = canvas.width / rect.width;
    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;
    const maxTraffic = maxTrafficRef.current;

    for (const c of countries) {
      const proj = geoOrthographic()
        .rotate([rotation.current[0], rotation.current[1], 0])
        .translate([canvas.width / 2, canvas.height / 2])
        .scale(canvas.width / 2.15)
        .clipAngle(90);
      const projected = proj([c.lon, c.lat]);
      if (!projected) continue;
      const dx = projected[0] - x;
      const dy = projected[1] - y;
      const r = 3 + (c.traffic / maxTraffic) * 5 + 10;
      if (dx * dx + dy * dy < r * r) return c;
    }
    return null;
  }, [countries]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (isDragging.current) {
        if (!lastPos.current) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasMoved.current = true;
        rotation.current[0] += dx * 0.35;
        rotation.current[1] = Math.max(-55, Math.min(55, rotation.current[1] - dy * 0.35));
        lastPos.current = { x: e.clientX, y: e.clientY };

        if (rafDrag.current) cancelAnimationFrame(rafDrag.current);
        rafDrag.current = requestAnimationFrame(draw);
        return;
      }

      if (hoverThrottle.current) return;
      hoverThrottle.current = setTimeout(() => { hoverThrottle.current = null; }, 40);

      const hit = getHitCountry(e.clientX, e.clientY);
      const canvas = canvasRef.current;
      const rect = canvas?.getBoundingClientRect();
      if (hit && rect) {
        setTooltip({ country: hit, x: e.clientX - rect.left, y: e.clientY - rect.top });
        onCountryHover?.(hit.code);
      } else {
        setTooltip(null);
        onCountryHover?.(null);
      }
    },
    [draw, getHitCountry, onCountryHover]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    hasMoved.current = false;
    lastPos.current = { x: e.clientX, y: e.clientY };
    stopSpin();
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    isDragging.current = false;
    if (!hasMoved.current) {
      const hit = getHitCountry(e.clientX, e.clientY);
      if (hit) onCountrySelect?.(hit.code);
    }
    lastPos.current = null;
    if (isVisible.current) startSpin();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {loading && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl z-10"
          style={{ background: "var(--nos-bg-elevated)" }}
        >
          <div
            className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "var(--nos-accent-border)", borderTopColor: "var(--nos-accent)" }}
          />
          <p className="text-xs" style={{ color: "var(--nos-text-muted)" }}>Loading map…</p>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full rounded-xl max-w-[480px] mx-auto block"
        style={{ cursor: isDragging.current ? "grabbing" : "grab", aspectRatio: "1/1" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          isDragging.current = false;
          setTooltip(null);
          onCountryHover?.(null);
          if (isVisible.current) startSpin();
        }}
      />

      {tooltip && (
        <div
          className="absolute pointer-events-none z-20 px-3 py-2.5 rounded-xl text-center transition-opacity duration-150"
          style={{
            left: Math.min(tooltip.x + 12, 260),
            top: Math.max(tooltip.y - 72, 8),
            background: "var(--nos-bg-overlay)",
            border: "1px solid var(--nos-accent-border)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
            minWidth: 160,
          }}
        >
          <p className="text-lg leading-none mb-0.5">{tooltip.country.flag}</p>
          <p className="text-xs font-semibold" style={{ color: "var(--nos-text-primary)" }}>{tooltip.country.name}</p>
          <p className="text-sm font-bold mt-1" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--nos-text-primary)" }}>
            {fmt(tooltip.country.traffic)}
          </p>
          <p
            className="text-[10px] font-bold"
            style={{ color: tooltip.country.trafficChange >= 0 ? "var(--nos-positive)" : "var(--nos-negative)" }}
          >
            {fmtChange(tooltip.country.trafficChange)}
          </p>
          <p className="text-[9px] mt-1" style={{ color: "var(--nos-text-muted)" }}>Drag to rotate</p>
        </div>
      )}
    </div>
  );
});
