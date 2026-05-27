"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";

interface CardInfoButtonProps {
  description: string;
}

export function CardInfoButton({ description }: CardInfoButtonProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const panelWidth = 256;
    const left = Math.min(
      Math.max(8, rect.right - panelWidth),
      window.innerWidth - panelWidth - 8
    );
    setCoords({ top: rect.bottom + 6, left });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, updatePosition]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="What this card shows"
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (open) {
            setOpen(false);
            return;
          }
          const rect = buttonRef.current?.getBoundingClientRect();
          if (rect) {
            const panelWidth = 256;
            const left = Math.min(
              Math.max(8, rect.right - panelWidth),
              window.innerWidth - panelWidth - 8
            );
            setCoords({ top: rect.bottom + 6, left });
          }
          setOpen(true);
        }}
        className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--nos-text-muted)] hover:text-[var(--nos-text-primary)] hover:bg-[var(--nos-bg-elevated)] border border-transparent hover:border-[var(--border)] transition-colors cursor-pointer shrink-0"
      >
        <Info size={13} strokeWidth={2} />
      </button>

      {open &&
        coords &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Card description"
            style={{ top: coords.top, left: coords.left }}
            className="fixed z-[9999] w-64 rounded-lg border border-[var(--border)] bg-[var(--nos-bg-surface)] p-3 text-xs leading-relaxed text-[var(--nos-text-secondary)] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {description}
          </div>,
          document.body
        )}
    </>
  );
}
