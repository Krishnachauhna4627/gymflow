# GymFlow Design System — Rules

> **The theme is fixed.** GymFlow uses one *classic* theme: ivory paper, deep navy ink and
> brass accents, with serif headings. Do not change it, and do not introduce a second look.
> Every screen — landing page, dashboard, forms, dropdowns, calendars, tables, modals — must
> look like it belongs to the same product.

The source of truth for every value below is `frontend/src/styles.scss` (`:root` tokens and
shared classes). This document explains how to use them.

---

## 1. Golden rules

1. **Use tokens, never raw values.** Colors, fonts, radius, shadows and transitions come from
   CSS variables (`var(--navy)`, `var(--radius)` …). No hex codes, `rgb()` or font names inside
   component styles. The only exception is a translucent shade of an existing token (for example
   `rgba(201, 169, 110, 0.18)` for brass), and only when no token fits.
2. **Do not add, rename or re-value tokens** without updating this file in the same change.
   A new token is allowed only when no existing one fits, and it must belong to the palette.
3. **Reuse shared classes** (`.btn`, `.eyebrow`, `.container`) and shared components
   (`app-icon`) before you write new styles. If a pattern appears twice, move it into
   `styles.scss` or a shared component.
4. **No second theme.** No bright blue, no gradients outside the ones in section 2.5, no
   rounded "pill" shapes, no other icon libraries, no extra font families.
5. **Third-party UI libraries** (Angular Material, CDK overlays, date pickers, chart libraries)
   must be restyled to these tokens before they ship. A library's default look is never
   acceptable.
6. **Every interactive element has hover, focus-visible and disabled states** as defined here.

---

## 2. Foundations

### 2.1 Color palette

| Token            | Value     | Use for                                                      |
| ---------------- | --------- | ------------------------------------------------------------ |
| `--paper`        | `#f8f4ec` | Page background                                              |
| `--paper-deep`   | `#efe7d6` | Alternate section background, table row dividers, hover fill |
| `--surface`      | `#fffdf8` | Cards, inputs, dropdown panels, header                       |
| `--navy`         | `#1b2a41` | Headings, primary buttons, selected states, sidebars         |
| `--navy-deep`    | `#111c2e` | Primary button hover, footer, dark bands                     |
| `--ink`          | `#23252b` | Body text                                                    |
| `--muted`        | `#6a6457` | Secondary text, labels, placeholders, helper text            |
| `--rule`         | `#ddd2bc` | All borders and dividers                                     |
| `--brass`        | `#a8834a` | Accent: eyebrows, icons, links, active indicators, focus     |
| `--brass-light`  | `#c9a96e` | Accent on dark (navy) backgrounds                            |
| `--burgundy`     | `#8a2f2f` | Danger, errors, amounts due, absent                          |
| `--forest`       | `#3e6b4b` | Success, paid, present, confirmations                        |

**Status colors are fixed:**

| Meaning          | Color        | Tinted background                                         |
| ---------------- | ------------ | --------------------------------------------------------- |
| Success / paid   | `--forest`   | `color-mix(in srgb, var(--forest) 10%, var(--surface))`   |
| Danger / due     | `--burgundy` | `color-mix(in srgb, var(--burgundy) 10%, var(--surface))` |
| Warning / expiry | `--brass`    | `color-mix(in srgb, var(--brass) 12%, var(--surface))`    |
| Info / neutral   | `--navy`     | `color-mix(in srgb, var(--navy) 8%, var(--surface))`      |

Do not use pure white (`#fff`) for large areas; use `--surface`. White is allowed only inside
dense data panels, such as dashboard cards on an ivory background.

### 2.2 Typography

| Role           | Font                                  | Size                       | Weight         |
| -------------- | ------------------------------------- | -------------------------- | -------------- |
| H1 (hero)      | `--font-serif` (Playfair Display)     | `clamp(38px, 4.2vw, 56px)` | 700            |
| H2 (section)   | `--font-serif`                        | `clamp(28px, 3.4vw, 42px)` | 700            |
| H3 (card)      | `--font-serif`                        | 20–22px                    | 700            |
| Page title     | `--font-serif`                        | 28–32px                    | 700            |
| Body           | `--font-sans` (Source Sans 3)         | 17px (16px on mobile)      | 400            |
| Lead text      | `--font-sans`                         | 18–20px, `--muted`         | 400            |
| Label / small  | `--font-sans`                         | 13–15px                    | 600 for labels |
| Eyebrow        | `--font-sans`, uppercase, `0.22em` tracking | 13px                 | 600, `--brass` |

- Headings are always serif and navy. Body, UI controls, labels and table text are always sans.
- An *italic serif in brass* is the one accent treatment for headings (e.g. "*The Smart Way*").
  Use it at most once per heading.
- Numbers in tables, stats and prices use `font-variant-numeric: lining-nums` (plus
  `tabular-nums` in tables), so digits line up.
- Currency is `₹` with Indian grouping (`₹18,500`).

### 2.3 Spacing

Use this scale only: **4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 88 px**.

- Page side gutter: 24px (16px under 640px). Max content width: `--container` (1200px).
- Section vertical padding: 80–88px desktop, 56–64px mobile.
- Card padding: 24–36px. Gap between form fields: 20px.

### 2.4 Shape, borders, elevation

- **Radius:** `var(--radius)` (2px) on everything rectangular — buttons, inputs, cards,
  dropdowns, modals, calendar cells. `50%` is allowed only for avatars, icon medallions,
  status dots and progress rings. **No pill shapes.**
- **Borders:** `1px solid var(--rule)`. Featured cards use `3px double var(--rule)` and turn
  `--brass` on hover.
- **Elevation:** surfaces are separated by borders, not shadows. Only floating layers
  (dropdown panels, date picker popups, modals, toasts) use `var(--shadow-overlay)`.

### 2.5 Backgrounds & ornaments

- Light sections alternate between `--surface`, `--paper` and `--paper-deep`, each with a
  `1px var(--rule)` top or bottom border.
- Dark bands (CTA, footer, sidebar) use `--navy` / `--navy-deep`. Text on them is `--paper`
  (headings) or `rgba(248, 244, 236, 0.75)` (body), and the accent is `--brass-light`.
- Allowed decorations: the brass hairline before eyebrows, the `◆` ornament between two
  hairlines, double-rule borders, and the subtle diagonal line texture on dark bands. Nothing
  else.

### 2.6 Icons

- Only `app-icon` (`frontend/src/app/shared/icon.ts`): stroke line icons, `stroke-width` 1.6
  (2.2 for the logo), color `currentColor`. Add new icons there in the same style.
- Size them with `--icon-size` (default 20px).
- Feature and stat icons sit in a circular medallion: a 1px border in the icon's color, plus an
  optional outer ring of `outline: 1px solid var(--rule); outline-offset: 4px`.
- No emoji, no filled icon sets, no icon fonts.

### 2.7 Motion

Motion is calm and elegant: things *settle into place*. They never bounce, spin or flash.

- **Interaction** (hover, focus, open/close): `var(--transition)` (0.2s ease) on color,
  background, border and transform. Hover lift is at most `translateY(-3px)`.
- **Entrances** use `var(--ease-out)` and `var(--duration-enter)` (0.9s), with a rise of at most
  24px and a fade. The only motions allowed are fade-up, fade, and a line drawing in
  (`scaleX`). Built-in keyframes: `enter-up`, `enter-fade`, `draw-x`, `medallion-in` (in `styles.scss`).
  - **On page load** (above the fold), use the `.enter` class with `--enter-delay` for the
    stagger. Steps are 100–150ms apart, and the whole sequence finishes within about 2s.
  - **On scroll**, use the `appReveal` directive (`shared/reveal.ts`). The value is the stagger
    delay in ms, e.g. `[appReveal]="i * 120"`. Each element reveals only once.
  - Order: header → eyebrow rule → heading → text → actions → supporting visuals.
  - **Every section enters the same way:** the eyebrow's brass hairline draws in automatically
    (any `.eyebrow` with `.enter` or `appReveal`). Then the heading, then the text, then the
    cards one by one (120–150ms apart).
  - **Inside a card**, its contents follow the card in order (+150–450ms): icon medallion
    (`medallion-in`, a fade plus scale from 0.6), then title, then text or price. Use the
    card's `--reveal-delay` so the inner steps follow it.
  - Ornament hairlines (the `◆` divider) draw outward from the center.
- Entrance animations use `backwards` fill so they never block a component's own hover
  transitions.
- No looping or infinite animations on content. Loading spinners are the only exception.
- `prefers-reduced-motion: reduce` turns all motion off. This is handled globally; do not
  override it.

---

## 3. Components

All states must be implemented. **Focus** everywhere is the global `:focus-visible` style
(2px brass outline, 2px offset). For inputs, use `border-color: var(--navy)` plus
`box-shadow: var(--focus-ring)`. Never remove the focus outline without replacing it.

### 3.1 Buttons (`.btn`)

| Variant         | Class           | Default                          | Hover                          |
| --------------- | --------------- | -------------------------------- | ------------------------------ |
| Primary         | `.btn--primary` | `--navy` bg, `--paper` text      | `--navy-deep` bg               |
| Secondary       | `.btn--outline` | transparent, 1px `--navy` border | `--navy` bg, `--paper` text    |
| Accent (on dark)| `.btn--brass`   | `--brass` bg, white text         | darker brass                   |
| Danger          | `.btn--danger`* | `--burgundy` bg, `--paper` text  | 10% darker                     |
| Small           | `.btn--sm`      | 9px × 20px padding, 15px font    | —                              |

\* Add to `styles.scss` when it is first needed, following the same pattern.

- Font: sans, 600, `letter-spacing: 0.04em`. Default padding 14px × 30px. Radius `--radius`.
- Icons go after the label for "go forward" actions (→) and before it for media or actions (▶).
- Disabled: `opacity: 0.45`, no pointer events (already in `.btn`).
- **One primary button per view or section.** Pair it with an outline button, not a second
  primary.
- Text links use `--brass`, weight 600, no underline; underline on hover.

### 3.2 Form inputs (text, number, search, textarea)

- Height 46px (textarea: auto), padding 12px 14px, `--surface` background,
  `1px solid var(--rule)`, radius `--radius`, sans 16px `--ink`.
- Placeholder in `--muted`.
- Focus: `border-color: var(--navy); box-shadow: var(--focus-ring)`.
- Error: `border-color: var(--burgundy)` with a message below in `--burgundy`, 13px.
- Disabled: `--paper-deep` background, `--muted` text.
- Label above the field: sans 14px, 600, `--navy`, 6px gap. Helper text below: 13px `--muted`.
- Search fields have a leading `search` icon in `--muted`.

### 3.3 Dropdown / select / menu

- **Trigger** looks exactly like an input (3.2), with a trailing chevron icon in `--muted`
  that rotates 180° when open.
- **Panel:** `--surface` background, `1px solid var(--rule)` border, radius `--radius`,
  `var(--shadow-overlay)`, 4px offset from the trigger, max-height 280px with scroll.
- **Option:** 10px × 14px padding, sans 15px `--ink`.
  - Hover / keyboard-active: `--paper-deep` background.
  - Selected: `--navy` text, weight 600, a trailing `check` icon in `--brass`.
  - Disabled: `--muted` at 50% opacity.
- Group headings inside a panel use the eyebrow style (uppercase, 12px, brass, tracking).
- Native `<select>` must be restyled (`appearance: none`) to match. Never ship the browser
  default.

### 3.4 Calendar / date picker

- **Popup:** same panel rules as dropdowns (`--surface`, rule border, overlay shadow, 2px radius).
- **Header:** month and year in `--font-serif` 18px `--navy`. Previous/next buttons are
  icon-only ghost buttons that turn `--paper-deep` on hover.
- **Weekday row:** uppercase sans 12px, `0.12em` tracking, `--muted`.
- **Day cells:** square, 36–40px, radius `--radius`, sans 15px with `lining-nums tabular-nums`.
  - Hover: `--paper-deep` background.
  - **Today:** 1px `--brass` border.
  - **Selected:** `--navy` background, `--paper` text, weight 600.
  - **In range:** `--paper-deep` background; the range ends use the *selected* style.
  - Outside month / disabled: `--muted` at 40% opacity, not clickable.
- Attendance calendars mark days with status dots: present `--forest`, absent `--burgundy`,
  holiday `--brass`.
- The date input trigger follows 3.2, with a trailing `calendar` icon. Display format is
  `05 Oct 2026`.

### 3.5 Checkbox, radio, toggle

- Checkbox: 18px square, radius `--radius`, 1px `--rule` border on `--surface`; when
  checked, `--navy` fill with a `--paper` check mark.
- Radio: 18px circle, same colors; when checked, `--navy` ring with a navy inner dot.
- Toggle: 36 × 20px track with radius `--radius`. Off: `--paper-deep` track with a `--rule`
  border. On: `--navy` track with a `--surface` knob.

### 3.6 Cards & panels

- `--surface` (or white inside dashboards) background, `1px solid var(--rule)`, radius
  `--radius`, no shadow.
- Panel header: title in sans 600 `--navy` on the left, link action in `--brass` on the right.
- Clickable cards: hover changes the border to `--brass`, with an optional `translateY(-3px)`.

### 3.7 Tables

- Header cells: sans 13–14px, 600, `--muted`, bottom border `1px var(--rule)`.
- Body rows: bottom border `1px var(--paper-deep)`, hover `--paper` background.
- Numbers right-aligned with `tabular-nums`; money due in `--burgundy` 600; paid in `--forest`.
- Row actions use `.btn--sm` (primary for the main action, outline for others).
- Empty state: centered `--muted` text with an outline icon medallion.

### 3.8 Badges & status

- Rectangular (radius `--radius`), 4px × 10px padding, sans 12px, 600, uppercase, `0.06em`
  tracking.
- Colors come from the status table in 2.1 (tinted background with a solid text color).
  Examples: `Active` (forest), `Due` (burgundy), `Expiring` (brass), `Paused` (navy).

### 3.9 Navigation

- Top nav links: sans 16px `--ink`, hover `--brass`. The active link is `--navy` 600 with a
  2px `--brass` underline.
- Sidebar (app/dashboard): `--navy` background, items in `rgba(248, 244, 236, 0.75)`, hover
  `--paper`. The active item has a brass-tinted background and a 3px `--brass-light` left
  border.
- Tabs: same as top nav (brass underline for the active tab), with a `1px --rule` baseline.
- Breadcrumbs: 14px `--muted` with `/` separators; the current page is `--navy`.

### 3.10 Modals, dialogs, toasts

- Backdrop: `rgba(17, 28, 46, 0.55)`.
- Modal: `--surface`, radius `--radius`, `var(--shadow-overlay)`, max width 560px, 32px
  padding. Title in `--font-serif` 24px `--navy`, followed by a 1px `--rule` divider. Actions
  are right-aligned: outline Cancel, then primary Confirm. Destructive confirms use the danger
  button.
- Toasts: bottom-right, `--surface`, rule border, overlay shadow, and a 3px left border in the
  status color.

### 3.11 Charts & data visualization

- Series colors in this order: `--navy`, `--brass`, `--forest`, `--burgundy`, `--muted`.
- Gridlines in `--rule`; axis labels sans 12px `--muted`; titles follow the panel header rule.
- Progress rings and bars: track `--paper-deep`, value in the status color.

### 3.12 Avatars

- Circle, `--paper-deep` background, `--navy` initials, sans 600. Photos get a 1px `--rule`
  border.

---

## 4. Responsive rules

- Breakpoints: **1024px** (tablet: nav collapses into the menu button, two-column layouts
  stack) and **640px** (mobile: 16px gutters, full-width buttons in hero/forms).
- Never cause horizontal page scroll; wide tables scroll inside their own container.
- Touch targets are at least 40px tall on mobile.

---

## 5. Accessibility

- Body text contrast must stay at or above WCAG AA (`--ink` and `--muted` on `--paper` pass).
  Never put `--brass` text smaller than 13px on light backgrounds, and never `--muted` text on
  `--paper-deep` for long passages.
- Icon-only buttons need an `aria-label`. Decorative icons and mockups are `aria-hidden`.
- Color is never the only signal: pair status colors with a text label or icon.

---

## 6. Checklist before merging UI work

- [ ] No hard-coded colors, fonts, radii or shadows in component styles
- [ ] Only existing components/classes were used, or new ones were added to the shared layer
- [ ] Buttons, inputs, dropdowns and date pickers match section 3 exactly
- [ ] Hover, focus-visible, disabled and error states are implemented
- [ ] Checked at 1440px, 1024px and 390px widths
- [ ] Any token change is reflected in this document
