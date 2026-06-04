---
name: ui-design-system
description: Design UI/UX for web app screens and components. Use when the user asks for UI design, UX improvements, layout, responsive behavior, Tailwind styling, component specs, wireframes, empty/loading states, or accessibility guidance.
---

## Design Philosophy

Every generated interface should feel **modern, minimal, and production-ready** — not like a template.

### Core Principles

1. **Restraint over decoration.** Fewer elements, highly refined. White space is a feature.
2. **Typography carries hierarchy.** Use **Ubuntu** (Google Fonts, `next/font/google`) for UI and headings; **Ubuntu Mono** for code/IDs. Maximize weight contrast (300–400 body, 500–700 headings) — do not add Inter, Roboto, or Geist.
3. **One strong color moment.** Neutral palette first (warm off-whites, near-blacks, muted mid-tones). Introduce one confident accent. If it could appear on a poster or book cover, it's probably timeless.
4. **Spacing is structure.** Use an 8 px grid. Tighter gaps group related elements; generous gaps let hero content breathe.
5. **Accessibility is non-negotiable.** WCAG AA contrast minimums. Focus indicators. Semantic HTML. Keyboard navigation.
6. **No generic AI aesthetics.** Avoid: purple-on-white gradients, Inter/Roboto defaults, evenly-spaced card grids, and cookie-cutter layouts. Every interface should feel designed for its specific context.

### Quality Bar

The output should match what you'd expect from a senior product designer at a top SaaS company:
- Clean visual rhythm with intentional asymmetry
- Obvious interactive affordances (hover, focus, active states)
- Graceful edge cases (empty states, loading, error)
- Responsive without breakpoint artifacts

## Design tokens & Tailwind

**Read before writing styles:** [`tailwind.config.ts`](../../../tailwind.config.ts) (canonical color combinations) and [`design-tokens.md`](design-tokens.md) (quick reference).

- Token CSS: `src/design-system/tokens.css` · Theme utilities: `src/design-system/theme.css` · Wired via `src/app/globals.css` + `@config`
- Use **semantic classes only** (`bg-background`, `text-brand`, `border-border`) — never hex/oklch in JSX
- Pick a preset from `colorCombinations` in `tailwind.config.ts` for each surface (page, card, actions, status)
- **Brand** (`brand`, `brand-foreground`) = one accent moment; **primary** = neutral actions (buttons)
- 8px spacing grid: `gap-2` · `gap-4` · `gap-6` · card padding `p-4` (16px)

## Typography (Ubuntu)

**Loaded in** `src/app/layout.tsx` via `next/font/google` — never import fonts in individual pages.

| Role | Font | Tailwind | Weights |
| ---- | ---- | -------- | ------- |
| Body, labels, buttons | Ubuntu | `font-sans` | 300, 400, 500 |
| Headings, card titles | Ubuntu | `font-heading` | 500, 700 |
| Code, IDs | Ubuntu Mono | `font-mono` | 400, 700 |

- Presets: `typography` and `fonts` in [`tailwind.config.ts`](../../../tailwind.config.ts)
- Details: [design-tokens.md](design-tokens.md#typography-ubuntu)
- Headings: `font-heading` + `font-semibold` or `font-bold` + `tracking-tight`
- Do not load additional Google Fonts in components

## Components

- Use components from `@/components/ui` for all UI elements — never create one-off buttons, inputs, or dialogs.
- Built on **Base UI** primitives + **class-variance-authority** variants + Tailwind tokens.
- For icons, use **lucide-react**.
- For toasts, use `toast()` from **sonner** (rendered via `<Toaster />` in the root layout).

**→ Full component inventory, variants, and usage examples: [components.md](components.md)**

Available: Button, Card, Input, Label, Textarea, Badge, Alert, AlertDialog, Tabs, Separator, Progress, Toaster (`src/components/ui/`).

## Patterns

- Cards use 16px padding and 8px border radius
- Forms use 24px vertical spacing between fields
- AlertDialog confirmations are compact (`max-w-xs` / `max-w-sm`)
- **No gradients** in JSX or React-facing CSS — solid colors and opacity only.
- **No modals for forms** — prefer inline editing or a dedicated page; use `AlertDialog` only for confirmations.


## Workflow

### Step 1 — Identify Components

Read the user's request and determine which UI components are needed. Reference [components.md](components.md) for the full inventory, variants, and usage examples.

### Step 2 — Apply Best Practices

For each component in the interface, follow its best practices from [components.md](components.md). Key rules that apply broadly:

**Layout**
- Single-column forms — faster to scan
- Consistent vertical lanes in repeated rows (lists, tables)
- Fixed-width slots for icons and actions, even when empty
- Cards: media → title → meta → action hierarchy

**Interaction**
- Buttons: verb-first labels ("Save changes", not "Submit"), one primary per section
- AlertDialog: always provide Cancel + action; trap focus; return focus on close
- Toasts: auto-dismiss 4–6 s, allow manual dismiss, stack newest on top
- Toggles: immediate effect only — use checkboxes in forms that require Save

**Typography & Spacing**
- **Ubuntu only** — `font-sans` for body, `font-heading` for titles, `font-mono` for code
- Strict heading hierarchy (h1 → h2 → h3), one h1 per page; bolder weights on headings
- Minimum 44 px touch targets on mobile
- Labels above inputs (vertical forms) or beside (horizontal)
- Placeholder text as format hint, never as label replacement

**States**
- Empty states: illustration + helpful headline + primary CTA
- Loading: skeleton screens > spinners (show after 300 ms delay)
- Validation: inline on blur, not on every keystroke
- Disabled elements: visually distinct but still readable

### Step 3 — Choose a Design Direction

Select the style preset that best matches the user's intent, or ask if unclear:

**Modern SaaS** (default)
- Neutral palette, one strong accent
- 8 px grid, generous white space
- Clean, professional, spacious

**Apple-level Minimal**
- Near-monochrome, warm grays
- Large type hierarchy, tight tracking on display text
- Abundant white space, micro-interactions (150–250 ms ease-out)

**Enterprise / Corporate**
- Information-dense, well-defined regions
- Compact spacing scale (4/8/12/16/24 px)
- Robust form handling, fully keyboard-navigable

**Creative / Portfolio**
- Bold, expressive, strong visual personality
- Asymmetric layouts, dramatic scale contrast
- Editorial typography, vivid accent colors

**Data Dashboard**
- Data-dense, optimised for scannability
- Consistent vertical alignment across rows
- Clear metric hierarchy: KPI → trend → detail

### Step 4 — Generate Code

Write production-ready code following these rules:

```
Stack:       React + Tailwind CSS v4 (@config tailwind.config.ts)
Tokens:      src/design-system/tokens.css + colorCombinations in tailwind.config.ts
Spacing:     spacingScale in tailwind.config.ts — 8px grid (p-2, gap-4, gap-6)
Typography:  Ubuntu + Ubuntu Mono via src/app/layout.tsx; presets in tailwind.config.ts
States:      Implement hover, focus, active, disabled for all interactive elements
Responsive:  Mobile-first; test at 375, 768, 1440 px
Accessibility: Semantic HTML, ARIA where needed, focus management
```

## Anti-Patterns to Avoid

Never generate these — they signal generic, low-quality UI:

- **Rainbow badges** — every status a different bright color with no semantic meaning
- **Modal inside modal** — use a page or drawer for complex flows
- **Disabled submit with no explanation** — always indicate what's missing
- **Spinner for predictable layouts** — use skeleton screens instead
- **"Click here" links** — link text must describe the destination
- **Hamburger menu on desktop** — use visible navigation when space allows
- **Auto-advancing carousels** — let users control navigation
- **Placeholder-only form fields** — always use visible labels
- **Equal-weight buttons** — establish primary/secondary/tertiary hierarchy
- **Tiny text (< 12 px)** — body text minimum 14 px, prefer 16 px