"use client";

import { useTheme } from "next-themes";
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
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="w-8 h-8 rounded-lg flex items-center justify-center border border-[var(--border)] bg-[var(--nos-bg-elevated)] hover:bg-[var(--nos-bg-overlay)] transition-colors"
      suppressHydrationWarning
    >
      {mounted ? (
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Sun size={14} className="text-[var(--nos-text-secondary)]" />
          ) : (
            <Moon size={14} className="text-[var(--nos-text-secondary)]" />
          )}
        </motion.div>
      ) : (
        <Moon size={14} className="text-[var(--nos-text-secondary)]" />
      )}
    </motion.button>
  );
}
