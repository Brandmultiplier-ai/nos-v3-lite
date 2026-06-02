"use client";

import { useTheme } from "@/components/shared/ThemeProvider";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" : false;

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
      style={{
        border: "1px solid var(--border)",
        background: "var(--nos-bg-elevated)",
      }}
      suppressHydrationWarning
    >
      {mounted ? (
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {isDark ? (
            <Sun size={13} style={{ color: "var(--nos-text-muted)" }} />
          ) : (
            <Moon size={13} style={{ color: "var(--nos-text-muted)" }} />
          )}
        </motion.div>
      ) : (
        <Moon size={13} style={{ color: "var(--nos-text-muted)" }} />
      )}
    </motion.button>
  );
}
