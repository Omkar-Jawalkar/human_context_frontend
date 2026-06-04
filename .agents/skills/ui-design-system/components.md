# UI Component Reference

Full reference for the design system components in `src/components/ui/`.

**Stack:** Base UI primitives · class-variance-authority variants · Tailwind design tokens · lucide-react icons · sonner toasts

---

## Inventory

| Component | Import path | Exports | Variants / props |
| --------- | ----------- | ------- | ---------------- |
| **Button** | `@/components/ui/button` | `Button`, `buttonVariants` | `variant`: default, outline, secondary, ghost, destructive, link · `size`: default, xs, sm, lg, icon, icon-xs, icon-sm, icon-lg |
| **Card** | `@/components/ui/card` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` | `size`: default, sm |
| **Input** | `@/components/ui/input` | `Input` | Standard `<input>` props; `aria-invalid` for validation |
| **Label** | `@/components/ui/label` | `Label` | Pairs with inputs via `htmlFor` |
| **Textarea** | `@/components/ui/textarea` | `Textarea` | Auto-sizing via `field-sizing-content` |
| **Badge** | `@/components/ui/badge` | `Badge`, `badgeVariants` | `variant`: default, secondary, destructive, outline, ghost, link |
| **Alert** | `@/components/ui/alert` | `Alert`, `AlertTitle`, `AlertDescription`, `AlertAction` | `variant`: default, destructive |
| **AlertDialog** | `@/components/ui/alert-dialog` | `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogFooter`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogMedia`, `AlertDialogAction`, `AlertDialogCancel` | `size`: default, sm — use for destructive confirmations |
| **Tabs** | `@/components/ui/tabs` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`, `tabsListVariants` | `TabsList variant`: default, line · `orientation`: horizontal, vertical |
| **Separator** | `@/components/ui/separator` | `Separator` | `orientation`: horizontal, vertical |
| **Progress** | `@/components/ui/progress` | `Progress`, `ProgressTrack`, `ProgressIndicator`, `ProgressLabel`, `ProgressValue` | `value` 0–100 on root |
| **Toaster** | `@/components/ui/sonner` | `Toaster` | Theme-aware wrapper around sonner; mount once in root layout |

---

## Quick Reference

| Component | When to use | Key rule |
| --------- | ----------- | -------- |
| **Button** | Trigger actions | Verb-first labels; one primary per section |
| **Card** | Represent an entity | Header → content → footer; ring border, no extra shadow |
| **Input/Label** | Single-line form fields | Label above input; `aria-invalid` on validation errors |
| **Textarea** | Multi-line text | Use for queries, descriptions; auto-sizes to content |
| **Alert** | Inline status/errors | `variant="destructive"` for errors; max 2 sentences |
| **AlertDialog** | Confirm destructive ops | Cancel + action; never for data entry |
| **Tabs** | Switch panels | 2–7 tabs; `variant="line"` for underline style |
| **Badge** | Status/metadata label | 1–2 words; map status → semantic variant |
| **Progress** | Determinate progress | Pair with Badge for job/status cards |
| **Separator** | Visual divider | Horizontal in nav/toolbars; vertical in side-by-side layouts |
| **Toaster** | Brief confirmation | `toast.success/error()` via sonner; auto-dismiss 4–6 s |

---

## Usage Examples

### Button + form field

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
</div>
<Button type="submit" disabled={isSubmitting}>Save changes</Button>
```

### Card layout

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Supporting text</CardDescription>
  </CardHeader>
  <CardContent>{/* body */}</CardContent>
</Card>
```

### Inline alert (errors, status)

```tsx
import { Alert, AlertDescription } from "@/components/ui/alert";

{error ? (
  <Alert variant="destructive">
    <AlertDescription>{error}</AlertDescription>
  </Alert>
) : null}
```

### Destructive confirmation (AlertDialog)

```tsx
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete organization?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive" onClick={onConfirm}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="mine">Mine</TabsTrigger>
  </TabsList>
  <TabsContent value="all">{/* panel */}</TabsContent>
</Tabs>
```

### Toast notifications

```tsx
import { toast } from "sonner";

toast.success("Organization updated");
toast.error("Something went wrong");
```

Mount `<Toaster />` once in the root layout (`src/app/layout.tsx`).

### Progress + Badge (status displays)

```tsx
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

<Badge variant="secondary">processing</Badge>
<Progress value={60} />
```

### Separator (nav / layout)

```tsx
import { Separator } from "@/components/ui/separator";

<Separator orientation="horizontal" />
```

---

## Per-Component Notes

### Button

- **Primary action:** `variant="default"` — one per section max.
- **Secondary / cancel:** `variant="outline"`.
- **Destructive:** `variant="destructive"` — soft red background, not solid fill.
- **Icon-only:** `size="icon"` with a lucide icon child.

### Card

- Compose with sub-slots: `CardHeader` → `CardTitle` + optional `CardDescription` + optional `CardAction`.
- `size="sm"` reduces padding and gap for dense lists.
- Footer has a muted background and top border — use for actions.

### Alert vs AlertDialog

| | Alert | AlertDialog |
| - | ----- | ----------- |
| Purpose | Inline feedback | Blocking confirmation |
| Dismissible | Always visible until condition clears | User must choose Cancel or action |
| Use for | Form errors, API failures | Delete, irreversible actions |

### Tabs

- `TabsList variant="line"` — underline indicator, no pill background.
- Keep tab count between 2–7; use a page or filter for more options.

### Badge variants (status mapping)

| Status | Variant |
| ------ | ------- |
| Active / in-progress | `default` |
| Pending / neutral | `secondary` |
| Failed / error | `destructive` |
| Completed / success | `outline` |

See `src/components/import-job-status.tsx` for a real-world example.
