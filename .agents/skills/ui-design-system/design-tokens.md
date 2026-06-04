# Design tokens & Tailwind

Human Context uses **semantic design tokens** — never raw hex/oklch in components.

## Source files (read before styling)

| File | Purpose |
| ---- | ------- |
| [`tailwind.config.ts`](../../../tailwind.config.ts) | Approved **color combinations**, spacing scale, typography & radius presets |
| [`src/design-system/tokens.css`](../../../src/design-system/tokens.css) | CSS custom properties (`:root` / `.dark`) |
| [`src/design-system/theme.css`](../../../src/design-system/theme.css) | Maps tokens → Tailwind utilities (`bg-*`, `text-*`, etc.) |
| [`src/app/layout.tsx`](../../../src/app/layout.tsx) | Ubuntu + Ubuntu Mono via `next/font/google` |

## Rules

1. Import combinations from `tailwind.config.ts` → `colorCombinations` — pick the preset that matches the UI role.
2. Use Tailwind classes only: `bg-background`, `text-muted-foreground`, `border-brand`, not `#fff` or `oklch(...)`.
3. **One brand accent per view** — `brand` / `border-l-brand` / `text-brand` for highlights; `primary` stays near-neutral for actions.
4. Status colors are semantic: `success`, `warning`, `info`, `destructive` — map meaning → variant, not rainbow decoration.
5. Spacing on an **8px grid**: `gap-2` (8px), `gap-4` (16px), `gap-6` (24px), `p-4` (16px card padding).
6. Focus rings use `ring-ring` (brand-tinted in light mode).

## Standard color combinations

Copy classes from `colorCombinations` in `tailwind.config.ts`. Quick reference:

| Role | Classes |
| ---- | ------- |
| Page | `bg-background text-foreground` |
| Auth / soft canvas | `bg-muted/30 text-foreground` |
| Card | `bg-card text-card-foreground ring-1 ring-foreground/10` |
| Featured card | `bg-card … border-l-2 border-l-brand` |
| Muted inset | `bg-muted text-muted-foreground` |
| Brand moment | `bg-brand text-brand-foreground` or `text-brand` |
| Primary button | `bg-primary text-primary-foreground` |
| Secondary button | `bg-secondary text-secondary-foreground` |
| Destructive (soft) | `bg-destructive/10 text-destructive` |
| Input | `border-input` + `focus-visible:ring-ring/50` |
| Success status | `bg-success/10 text-success` |
| Error alert | `bg-destructive/10 text-destructive` (Alert `variant="destructive"`) |

## Typography (Ubuntu)

Fonts are loaded once in [`src/app/layout.tsx`](../../../src/app/layout.tsx) with `next/font/google`:

```tsx
import { Ubuntu, Ubuntu_Mono } from "next/font/google";
// Ubuntu: weights 300, 400, 500, 700 → --font-ubuntu
// Ubuntu Mono: weights 400, 700 → --font-ubuntu-mono
```

Mapped in [`src/design-system/theme.css`](../../../src/design-system/theme.css) to Tailwind utilities.

| Stack | Utility | Use for |
| ----- | ------- | ------- |
| Ubuntu | `font-sans` | Body copy, labels, inputs, buttons |
| Ubuntu | `font-heading` | Page titles, `CardTitle`, dialog titles |
| Ubuntu Mono | `font-mono` | Organization IDs, JSON, inline code |

**Do not** import other Google Fonts in pages or components.

### Presets (`typography` in `tailwind.config.ts`)

| Role | Classes |
| ---- | ------- |
| h1 (one per page) | `font-heading text-xl font-bold tracking-tight` |
| h2 | `font-heading text-lg font-semibold tracking-tight` |
| Body | `font-sans text-sm md:text-base` |
| Muted copy | `font-sans text-sm text-muted-foreground leading-relaxed` |
| Labels | `font-sans text-sm font-medium` |
| Brand / app name | `font-heading text-lg font-bold tracking-tight` |

### Weight guidance

- Body: `font-normal` (400) or `font-light` (300) for large marketing copy
- UI emphasis: `font-medium` (500)
- Headings: `font-semibold` (500) or `font-bold` (700)

## Dark mode

Tokens swap automatically under `.dark`. Do not hand-pick separate light/dark colors in JSX — rely on semantic classes.
