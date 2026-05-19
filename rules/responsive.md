# Responsive Design Rules — Mobile First, White Mode Only

> Applies to: **DIFWA** (Next.js 16 / Tailwind v4) and **EPOOJAPAATH** (Next.js 14 / Tailwind v3)
> Theme: **White / Light mode only. No dark mode classes.**

---

## 1. Mobile-First Breakpoints

Always write base styles for mobile (no prefix), then override upward.

```tsx
// Correct — mobile base, scale up
<div className="flex flex-col gap-3 md:flex-row md:gap-6">

// Wrong — desktop base, overriding down
<div className="flex flex-row md:flex-col">
```

| Prefix | Width  | Use for              |
|--------|--------|----------------------|
| *(none)* | 0px  | Mobile (default)     |
| `sm:`  | 640px  | Large phone / tablet portrait |
| `md:`  | 768px  | Tablet landscape     |
| `lg:`  | 1024px | Desktop              |
| `xl:`  | 1280px | Wide desktop         |

---

## 2. Layout & Containers

- Every page content area must be wrapped in a centered max-width container.
- Use `w-full` — never hardcode pixel widths on containers.

```tsx
<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
```

- Stack vertically on mobile, switch to row on tablet/desktop:

```tsx
<div className="flex flex-col gap-4 md:flex-row">
```

---

## 3. Grid — Responsive Columns

Always start at 1 column on mobile, increase per breakpoint:

```tsx
// Cards / product grids
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

// Dashboard panels
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

// Stat cards
<div className="grid grid-cols-2 gap-3 md:grid-cols-4">
```

---

## 4. Spacing

Use responsive padding and margin — smaller on mobile, larger on desktop:

```tsx
// Page vertical padding
<section className="py-8 md:py-12 lg:py-16">

// Section inner padding
<div className="p-4 md:p-6 lg:p-8">

// Container horizontal padding
<div className="px-4 sm:px-6 lg:px-8">
```

---

## 5. Typography

Scale font sizes up from mobile:

```tsx
// Page heading
<h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">

// Section heading
<h2 className="text-xl font-semibold text-gray-800 md:text-2xl">

// Body text
<p className="text-sm text-gray-600 md:text-base">

// Caption / label
<span className="text-xs text-gray-500">
```

- Long text on mobile: use `line-clamp-2` to prevent overflow, remove on desktop:

```tsx
<p className="line-clamp-2 md:line-clamp-none text-sm text-gray-600">
```

---

## 6. Images

Always use Next.js `<Image>`. Never use raw `<img>`.

```tsx
// Responsive fill image (cards, banners)
<div className="relative h-40 w-full overflow-hidden rounded-xl sm:h-52">
  <Image src={src} alt={alt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
</div>

// Fixed logo / icon image
<Image src={logo} alt="Logo" width={100} height={36} priority />
```

---

## 7. Navigation — Mobile Sidebar / Hamburger

- On mobile: sidebar is hidden by default, toggled via hamburger icon.
- On desktop: sidebar is always visible.

```tsx
// Sidebar wrapper
<aside className={cn(
  "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transition-transform duration-300",
  isOpen ? "translate-x-0" : "-translate-x-full",
  "lg:relative lg:translate-x-0 lg:shadow-none"
)}>

// Hamburger — visible only on mobile
<button className="lg:hidden p-2 text-gray-700" onClick={toggleSidebar} aria-label="Open menu">
  <Menu className="h-5 w-5" />
</button>
```

---

## 8. Cards

Mobile cards are full-width and stack. On larger screens they sit in a grid:

```tsx
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <div className="w-full rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
    ...
  </div>
</div>
```

---

## 9. Tables — Responsive on Mobile

Never let a data table overflow horizontally on mobile. Wrap in a scroll container:

```tsx
<div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white">
  <table className="min-w-full text-sm text-gray-700">
    <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
      ...
    </thead>
    ...
  </table>
</div>
```

For very small screens, consider hiding non-essential columns:

```tsx
<td className="hidden md:table-cell px-4 py-3">
```

---

## 10. Buttons

Scale button size and make full-width on mobile when primary:

```tsx
// Primary CTA — full width on mobile, auto on desktop
<button className="w-full rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-600 md:w-auto">
  Confirm Order
</button>

// Secondary / icon button
<button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
  <Filter className="h-4 w-4" />
  Filter
</button>
```

---

## 11. Modals

On mobile, modals should slide up from the bottom (sheet pattern). On desktop, centered dialog:

```tsx
<div className={cn(
  "fixed z-50 bg-white shadow-xl",
  // Mobile: bottom sheet
  "bottom-0 left-0 right-0 rounded-t-2xl p-6",
  // Desktop: centered modal
  "md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:w-full md:max-w-lg"
)}>
```

---

## 12. Forms

- Inputs are always full-width on mobile.
- Multi-column form layout only from `md:` up.

```tsx
// Single column on mobile, two columns on desktop
<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">Name</label>
    <input className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" />
  </div>
</div>
```

---

## 13. White Mode Colors — Reference Palette

Use only these values. No `dark:` classes anywhere.

| Purpose              | Class                          |
|----------------------|--------------------------------|
| Page background      | `bg-white` or `bg-gray-50`     |
| Card background      | `bg-white`                     |
| Border               | `border-gray-200`              |
| Divider              | `divide-gray-100`              |
| Primary heading      | `text-gray-900`                |
| Body text            | `text-gray-700`                |
| Muted / caption text | `text-gray-500`                |
| Placeholder          | `placeholder-gray-400`         |
| Primary action (DIFWA) | `bg-cyan-500 text-white`     |
| Primary action (EPOOJAPAATH) | `bg-amber-500 text-white` |
| Hover background     | `hover:bg-gray-50`             |
| Active / selected    | `bg-cyan-50 text-cyan-700`     |
| Danger               | `bg-red-50 text-red-600`       |
| Success              | `bg-green-50 text-green-600`   |
| Warning              | `bg-yellow-50 text-yellow-700` |
| Shadow               | `shadow-sm` or `shadow-md`     |

---

## 14. Hide / Show by Screen Size

```tsx
// Visible only on mobile
<div className="block md:hidden">

// Visible only on desktop
<div className="hidden md:block">

// Visible from tablet up
<div className="hidden sm:flex">
```

---

## 15. Quick Checklist

- [ ] Base styles written for mobile (no breakpoint prefix)
- [ ] No hardcoded `px` widths on layout containers
- [ ] `<Image>` used with `alt`, `sizes`, and correct dimensions
- [ ] No `dark:` classes — white mode only
- [ ] No inline `style` for colors — use Tailwind classes from the palette above
- [ ] Tables wrapped in `overflow-x-auto`
- [ ] Primary CTA buttons are `w-full` on mobile
- [ ] Sidebar hidden on mobile, toggled with hamburger
- [ ] Modals use bottom-sheet on mobile, centered on desktop
- [ ] Spacing and font sizes scale up with breakpoints, not down
