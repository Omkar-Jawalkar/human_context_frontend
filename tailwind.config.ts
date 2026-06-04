import type { Config } from "tailwindcss";

/**
 * Human Context design system — Tailwind v4 config.
 *
 * Runtime tokens live in `src/design-system/tokens.css` (CSS variables).
 * Theme utilities are registered in `src/design-system/theme.css` via `@theme inline`.
 *
 * When building UI, use **semantic token classes only** (e.g. `bg-background`,
 * `text-muted-foreground`). Do not hard-code hex/oklch in components.
 */

/** Approved background + foreground (+ optional border/focus) pairings */
export const colorCombinations = {
  page: {
    description: "Default app shell and full-page layouts",
    classes: "bg-background text-foreground",
  },
  pageMuted: {
    description: "Auth screens, marketing strips, secondary canvases",
    classes: "bg-muted/30 text-foreground",
  },
  card: {
    description: "Primary content containers",
    classes:
      "bg-card text-card-foreground ring-1 ring-foreground/10",
  },
  cardElevated: {
    description: "Featured card with brand accent edge",
    classes:
      "bg-card text-card-foreground border-l-2 border-l-brand shadow-sm ring-1 ring-foreground/8",
  },
  popover: {
    description: "Dropdowns, menus, tooltips panel surface",
    classes: "bg-popover text-popover-foreground border border-border",
  },
  mutedPanel: {
    description: "Inset regions, table headers, secondary blocks",
    classes: "bg-muted text-muted-foreground",
  },
  accentPanel: {
    description: "Subtle brand-tinted callouts (not primary actions)",
    classes: "bg-accent text-accent-foreground",
  },
  brandHighlight: {
    description: "Single strong accent moment — badges, key metrics, left borders",
    classes: "bg-brand text-brand-foreground",
  },
  brandText: {
    description: "Accent text and icons without filled background",
    classes: "text-brand",
  },
  primaryAction: {
    description: "Default Button variant — one per section",
    classes: "bg-primary text-primary-foreground hover:bg-primary/80",
  },
  secondaryAction: {
    description: "Secondary Button / cancel-adjacent actions",
    classes:
      "bg-secondary text-secondary-foreground border border-border hover:bg-muted",
  },
  ghostAction: {
    description: "Tertiary navigation and icon triggers",
    classes: "text-foreground hover:bg-muted hover:text-foreground",
  },
  destructiveAction: {
    description: "Soft destructive Button — not solid fill",
    classes:
      "bg-destructive/10 text-destructive hover:bg-destructive/20",
  },
  destructiveSolid: {
    description: "Irreversible AlertDialog confirm only",
    classes: "bg-destructive text-background",
  },
  inputField: {
    description: "Text inputs at rest",
    classes:
      "bg-transparent border border-input text-foreground placeholder:text-muted-foreground",
  },
  inputFocus: {
    description: "Focused input ring (applied via focus-visible utilities)",
    classes: "border-ring ring-3 ring-ring/50",
  },
  inputInvalid: {
    description: "Validation errors on inputs",
    classes:
      "border-destructive ring-3 ring-destructive/20 aria-invalid:border-destructive",
  },
  link: {
    description: "Inline text links",
    classes:
      "text-foreground font-medium underline-offset-4 hover:text-foreground/80 hover:underline",
  },
  separator: {
    description: "Horizontal/vertical dividers",
    classes: "bg-border",
  },
  sidebar: {
    description: "Sidebar shell",
    classes: "bg-sidebar text-sidebar-foreground border-sidebar-border",
  },
  sidebarActive: {
    description: "Active sidebar item",
    classes: "bg-sidebar-accent text-sidebar-accent-foreground",
  },
  statusSuccess: {
    description: "Completed jobs, positive confirmations",
    classes: "bg-success/10 text-success border border-success/20",
  },
  statusWarning: {
    description: "Pending or attention-needed states",
    classes: "bg-warning/10 text-warning border border-warning/20",
  },
  statusError: {
    description: "Inline Alert destructive variant",
    classes: "bg-destructive/10 text-destructive border border-destructive/20",
  },
  statusInfo: {
    description: "Neutral informational callouts",
    classes: "bg-info/10 text-info border border-info/20",
  },
  badgeDefault: {
    description: "Active / in-progress Badge",
    classes: "bg-primary text-primary-foreground",
  },
  badgeNeutral: {
    description: "Pending / metadata Badge",
    classes: "bg-secondary text-secondary-foreground",
  },
  badgeSuccess: {
    description: "Completed Badge",
    classes: "border border-success/30 text-success bg-success/5",
  },
  badgeError: {
    description: "Failed Badge",
    classes: "bg-destructive/10 text-destructive",
  },
} as const;

export type ColorCombinationKey = keyof typeof colorCombinations;

/** 8px grid spacing — prefer these Tailwind steps */
export const spacingScale = {
  0: "0px",
  0.5: "2px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  touch: "44px minimum — use min-h-touch / h-10+ on mobile controls",
} as const;

/**
 * Typography — Ubuntu via `next/font/google` in `src/app/layout.tsx`.
 * Do not add other Google Fonts in components; use weight contrast on Ubuntu.
 */
export const fonts = {
  /** CSS variables set on `<html>` by next/font */
  variables: {
    sans: "--font-ubuntu",
    mono: "--font-ubuntu-mono",
  },
  /** Tailwind utilities (from theme.css) */
  utility: {
    sans: "font-sans",
    heading: "font-heading",
    mono: "font-mono",
  },
  weights: {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    bold: "font-bold",
  },
  stacks: {
    sans: "Ubuntu — body, UI, buttons (300–700)",
    heading: "Ubuntu — titles via font-heading + semibold/bold",
    mono: "Ubuntu Mono — IDs, code snippets (400, 700)",
  },
} as const;

/** Typography scale */
export const typography = {
  h1: "font-heading text-xl font-bold tracking-tight",
  h2: "font-heading text-lg font-semibold tracking-tight",
  h3: "font-heading text-base font-medium",
  body: "font-sans text-sm font-normal md:text-base text-foreground",
  bodyMuted: "font-sans text-sm font-normal text-muted-foreground leading-relaxed",
  label: "font-sans text-sm font-medium text-foreground",
  caption: "font-sans text-xs font-normal text-muted-foreground",
  brand: "font-heading text-lg font-bold tracking-tight",
} as const;

/** Border radius tokens (maps to --radius in tokens.css) */
export const radii = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  card: "rounded-xl",
  input: "rounded-lg",
  button: "rounded-lg",
} as const;

const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
} satisfies Config;

export default config;
