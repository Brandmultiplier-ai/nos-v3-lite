"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useClientData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2, RefreshCw, Plug, Loader2, X } from "lucide-react";
import type { Integration } from "@/lib/data/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const CATEGORY_ORDER = ["crm", "social", "seo", "outreach", "website-intel", "analytics", "paid-media"];
const CATEGORY_LABELS: Record<string, string> = {
  crm: "CRM",
  social: "Social Channels",
  seo: "SEO & Search",
  outreach: "Outreach Sequencer",
  "website-intel": "Website Intelligence",
  analytics: "Analytics",
  "paid-media": "Paid Media",
};

/* ─── Authentic brand logos (official marks) ─── */
const BRAND_ICONS: Record<string, { path: string; glyph: string; tile?: string; gradient?: boolean; border?: string }> = {
  "crm": { path: "M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z", glyph: "#fff", tile: "#FF7A59" },
  "linkedin": { path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z", glyph: "#fff", tile: "#0A66C2" },
  "linkedin-ads": { path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z", glyph: "#fff", tile: "#0A66C2" },
  "instagram": { path: "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077", glyph: "#fff", gradient: true },
  "facebook": { path: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z", glyph: "#fff", tile: "#1877F2" },
  "meta-ads": { path: "M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z", glyph: "#fff", tile: "#0866FF" },
  "tiktok": { path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z", glyph: "#fff", tile: "#000000" },
  "tiktok-ads": { path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z", glyph: "#fff", tile: "#000000" },
  "x-twitter": { path: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z", glyph: "#fff", tile: "#000000" },
  "x-ads": { path: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z", glyph: "#fff", tile: "#000000" },
  "reddit": { path: "M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z", glyph: "#fff", tile: "#FF4500" },
  "reddit-ads": { path: "M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z", glyph: "#fff", tile: "#FF4500" },
  "analytics": { path: "M22.84 2.9982v17.9987c.0086 1.6473-1.3197 2.9897-2.967 2.9984a2.9808 2.9808 0 01-.3677-.0208c-1.528-.226-2.6477-1.5558-2.6105-3.1V3.1204c-.0369-1.5458 1.0856-2.8762 2.6157-3.1 1.6361-.1915 3.1178.9796 3.3093 2.6158.014.1201.0208.241.0202.3619zM4.1326 18.0548c-1.6417 0-2.9726 1.331-2.9726 2.9726C1.16 22.6691 2.4909 24 4.1326 24s2.9726-1.3309 2.9726-2.9726-1.331-2.9726-2.9726-2.9726zm7.8728-9.0098c-.0171 0-.0342 0-.0513.0003-1.6495.0904-2.9293 1.474-2.891 3.1256v7.9846c0 2.167.9535 3.4825 2.3505 3.763 1.6118.3266 3.1832-.7152 3.5098-2.327.04-.1974.06-.3983.0593-.5998v-8.9585c.003-1.6474-1.33-2.9852-2.9773-2.9882z", glyph: "#E8710A", tile: "#fff", border: "#E5E7EB" },
};

function BrandLogo({ id, size = 32 }: { id: string; size?: number }) {
  const s = size;
  const icon = BRAND_ICONS[id];
  if (icon) {
    const pad = 5;
    const scale = (32 - pad * 2) / 24;
    return (
      <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
        {icon.gradient ? (
          <>
            <defs>
              <linearGradient id={`brand-ig-${s}`} x1="0" y1="32" x2="32" y2="0">
                <stop offset="0%" stopColor="#FED373" />
                <stop offset="25%" stopColor="#F15245" />
                <stop offset="50%" stopColor="#D92E7F" />
                <stop offset="75%" stopColor="#9B36B7" />
                <stop offset="100%" stopColor="#515BD4" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="7" fill={`url(#brand-ig-${s})`} />
          </>
        ) : (
          <rect width="32" height="32" rx="7" fill={icon.tile} stroke={icon.border ?? "none"} />
        )}
        <g transform={`translate(${pad}, ${pad}) scale(${scale})`}>
          <path d={icon.path} fill={icon.glyph} />
        </g>
      </svg>
    );
  }
  switch (id) {
    /* Instantly — email sequencer (recreated mark) */
    case "instantly":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#5B5BF0" />
          <path d="M18 5 9.5 17.5H14.5L13 27 22.5 14H17.4L18 5Z" fill="#fff" />
        </svg>
      );
    /* Smartlead — official mark (megaphone on violet) */
    case "smartlead":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#6C5CE7" />
          <circle cx="11" cy="13" r="3.7" fill="#fff" />
          <rect x="9.3" y="15.4" width="3.4" height="6" rx="1.7" fill="#fff" />
          <path d="M14.6 8.2 24 13 14.6 17.8Z" fill="#fff" />
          <circle cx="26.4" cy="13" r="1.7" fill="#fff" />
        </svg>
      );
    /* Salesloft — official mark (serif S + lime dot on dark green) */
    case "salesloft":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#0E2E1C" />
          <text x="13.5" y="24" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="21" fontWeight="700" fill="#fff">S</text>
          <circle cx="22" cy="21.5" r="2.5" fill="#93C83F" />
        </svg>
      );
    /* Vector — official mark (serif V on blue) */
    case "vector":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#1452F0" />
          <text x="16" y="23.5" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="20" fontWeight="700" fill="#fff">V</text>
        </svg>
      );
    /* Demandbase — monogram mark (serif D on navy) */
    case "demandbase":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#0B1F3A" />
          <text x="16" y="23.5" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="20" fontWeight="700" fill="#fff">D</text>
        </svg>
      );
    /* TechTarget — monogram mark (serif T on red) */
    case "techtarget":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#C8102E" />
          <text x="16" y="23.5" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="20" fontWeight="700" fill="#fff">T</text>
        </svg>
      );
    /* Gartner Digital Markets — monogram mark (serif G on purple) */
    case "gartner-digital-markets":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#6B2E8C" />
          <text x="16" y="23.5" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="20" fontWeight="700" fill="#fff">G</text>
        </svg>
      );
    /* RB2B — official mark (black wordmark on lime green) */
    case "rb2b":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="#5CE600" />
          <text x="16" y="19" textAnchor="middle" fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontSize="8.4" fontWeight="800" letterSpacing="0.3" fill="#000">RB2B</text>
        </svg>
      );
    /* Google Search Console — official multicolor (kept) */
    case "google-search":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="white" stroke="#E5E7EB" />
          <path d="M23 16.2h-7v2.6h4.1c-.4 2-2.1 3.2-4.1 3.2a4.5 4.5 0 0 1 0-9c1.2 0 2.2.4 3 1.1l1.8-1.8A7 7 0 1 0 16 23a7 7 0 0 0 7-7c0-.3 0-.6-.1-.8z" fill="#4285F4" />
          <path d="M9.5 13.7l2.1 1.6a4.5 4.5 0 0 1 7.4-1l1.8-1.8A7 7 0 0 0 9.5 13.7z" fill="#EA4335" />
          <path d="M16 23a7 7 0 0 0 4.7-1.8l-2.2-1.7A4.5 4.5 0 0 1 11.6 17l-2.1 1.6A7 7 0 0 0 16 23z" fill="#34A853" />
          <path d="M9.5 18.3l2.1-1.6a4.5 4.5 0 0 1 0-3.4L9.5 11.7a7 7 0 0 0 0 6.6z" fill="#FBBC04" />
        </svg>
      );
    /* Google Ads — official multicolor (kept) */
    case "google-ads":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="white" stroke="#E5E7EB" />
          <rect x="6" y="20" width="5" height="7" rx="2.5" fill="#FBBC04" />
          <rect x="13.5" y="14" width="5" height="13" rx="2.5" fill="#4285F4" />
          <rect x="21" y="8" width="5" height="19" rx="2.5" fill="#34A853" />
        </svg>
      );
    /* Generic / not-yet-mapped (Email Sequencer, Website Intelligence) */
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="7" fill="var(--nos-bg-elevated)" />
          <circle cx="16" cy="16" r="5" stroke="var(--nos-text-muted)" strokeWidth="1.5" fill="none" />
        </svg>
      );
  }
}

/* ─── Connect dialog ─── */
interface ConnectDialogProps {
  integration: Integration | null;
  onClose: () => void;
}

function ConnectDialog({ integration, onClose }: ConnectDialogProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!integration) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2200);
  }

  function handleClose() {
    setUsername("");
    setPassword("");
    setLoading(false);
    setSuccess(false);
    onClose();
  }

  return (
    <Dialog open={!!integration} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm" style={{ background: "var(--nos-bg-card)", border: "1px solid var(--border)" }}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
              <BrandLogo id={integration.id} size={40} />
            </div>
            <div>
              <DialogTitle className="text-sm font-semibold text-[var(--nos-text-primary)]">
                Connect {integration.name}
              </DialogTitle>
              <DialogDescription className="text-[11px] text-[var(--nos-text-muted)] mt-0.5">
                Enter your credentials to link this account.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-6"
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "rgba(52,211,153,0.12)" }}>
                <CheckCircle2 size={28} className="text-[var(--nos-positive)]" />
              </div>
              <p className="text-sm font-semibold text-[var(--nos-text-primary)]">Connected successfully!</p>
              <p className="text-xs text-[var(--nos-text-muted)] text-center">
                {integration.name} has been linked. Data will sync momentarily.
              </p>
              <Button
                className="mt-2 w-full bg-[var(--nos-positive)] text-white hover:opacity-90"
                onClick={handleClose}
              >
                Done
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[var(--nos-text-secondary)]">
                  {integration.category === "crm" ? "API Key / Username" : "Username or Email"}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={integration.category === "crm" ? "your-api-key" : `your@email.com`}
                  required
                  disabled={loading}
                  className="w-full rounded-lg px-3 py-2 text-sm border outline-none transition-colors"
                  style={{
                    background: "var(--nos-bg-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--nos-text-primary)",
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-[var(--nos-text-secondary)]">
                  {integration.category === "crm" ? "API Secret" : "Password"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  disabled={loading}
                  className="w-full rounded-lg px-3 py-2 text-sm border outline-none transition-colors"
                  style={{
                    background: "var(--nos-bg-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--nos-text-primary)",
                  }}
                />
              </div>
              <p className="text-[10px] text-[var(--nos-text-muted)]">
                Your credentials are encrypted and never stored in plain text.
              </p>
              <div className="flex gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={handleClose}
                  disabled={loading}
                  style={{ borderColor: "var(--border)", color: "var(--nos-text-secondary)" }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="flex-1 gap-2"
                  disabled={loading || !username || !password}
                  style={{ background: "var(--nos-accent)", color: "white" }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Connecting…
                    </>
                  ) : (
                    <>
                      <Plug size={13} />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Integration card ─── */
function IntegrationCard({
  integration,
  onConnect,
}: {
  integration: Integration;
  onConnect: (i: Integration) => void;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="nos-card flex items-center gap-4"
    >
      {/* Logo */}
      <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
        <BrandLogo id={integration.id} size={36} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-[var(--nos-text-primary)] truncate">{integration.name}</p>
          {integration.connected ? (
            <Badge className="text-[9px] bg-[var(--nos-positive)] bg-opacity-15 text-[var(--nos-positive)] border-[var(--nos-positive)] border-opacity-30 shrink-0">
              Connected
            </Badge>
          ) : (
            <Badge className="text-[9px] bg-[var(--nos-bg-elevated)] text-[var(--nos-signal-cold)] border-[var(--border)] shrink-0">
              Disconnected
            </Badge>
          )}
        </div>
        {integration.connected ? (
          <div className="flex items-center gap-1 mt-0.5">
            <RefreshCw size={10} className="text-[var(--nos-text-muted)]" />
            <p className="text-[10px] text-[var(--nos-text-muted)]">Sample environment — no live sync.</p>
          </div>
        ) : (
          <p className="text-[10px] text-[var(--nos-text-muted)] mt-0.5">Not connected</p>
        )}
      </div>

      {integration.connected ? (
        <CheckCircle2 size={16} className="text-[var(--nos-positive)] shrink-0" />
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 gap-1.5 text-xs border-[var(--nos-accent-border)] text-[var(--nos-accent)] hover:bg-[var(--nos-accent-muted)]"
          onClick={() => onConnect(integration)}
        >
          <Plug size={11} />
          Connect
        </Button>
      )}
    </motion.div>
  );
}

interface SectionProps {
  variant?: "a" | "b" | "c";
}

export function Integrations({ variant = "a" }: SectionProps) {
  const data = useClientData();
  const { integrations } = data;
  const [connectTarget, setConnectTarget] = useState<Integration | null>(null);

  const byCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: integrations.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0);

  const connectedCount = integrations.filter((i) => i.connected).length;
  const totalCount = integrations.length;

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {/* Health summary */}
        <motion.div variants={itemVariants} className="nos-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--nos-text-primary)]">Integration Health</p>
              <p className="text-xs text-[var(--nos-text-muted)] mt-0.5">
                {connectedCount} of {totalCount} integrations active
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-wrap gap-1 max-w-32 justify-end">
                {integrations.map((integ) => (
                  <div
                    key={integ.id}
                    className="w-2 h-2 rounded-full"
                    style={{ background: integ.connected ? "var(--nos-positive)" : "var(--nos-bg-elevated)" }}
                    title={integ.name}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-[var(--nos-positive)]">
                {Math.round((connectedCount / totalCount) * 100)}%
              </span>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-[var(--nos-bg-elevated)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(connectedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-[var(--nos-positive)]"
            />
          </div>
        </motion.div>

        {/* Category groups */}
        {byCategory.map((group) => (
          <motion.div key={group.category} variants={itemVariants}>
            <h3 className="text-xs text-label-caps mb-3">{group.label}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.items.map((integ) => (
                <IntegrationCard
                  key={integ.id}
                  integration={integ}
                  onConnect={setConnectTarget}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Connect dialog */}
      <ConnectDialog
        integration={connectTarget}
        onClose={() => setConnectTarget(null)}
      />
    </>
  );
}
