Add a light/dark mode icon button to the header on all screens beside the language icon.

On click of that button the theme would switch from dark to light and light to dark. The icon could be sun and moon whic switches based on the selected theme.

Use the following React best practices throughout.

---

## ARCHITECTURE — THEME SYSTEM

### 1. ThemeContext

Create a ThemeContext and ThemeProvider in a separate 

context/ThemeContext.jsx file:

- State: theme — 'dark' (default) | 'light'

- On mount: read from localStorage key 'hp-theme', 

  default to 'dark' if not set

- On toggle: flip theme, save to localStorage, 

  set data-theme attribute on the document root element

- Export: useTheme() hook for consuming components

Wrap the entire app in ThemeProvider so all components 

have access.

### 2. CSS Variables

Define two sets of CSS variables in index.css or App.css:

:root, [data-theme="dark"] {

  --color-surface-1: #0E141F;

  --color-surface-2: #182235;

  --color-surface-3: #121A28;

  --color-surface-4: #1F2B42;

  --color-surface-5: #253552;

  --color-brand: #2B5597;

  --color-brand-hover: #5E7FC8;

  --color-text-primary: #E7ECF5;

  --color-text-secondary: #B6C2D9;

  --color-text-tertiary: #8A9AB6;

  --color-text-muted: #5F6F8A;

  --color-success: #4ED199;

  --color-warning: #FFDA8A;

  --color-error: #F7A3A8;

  --color-info: #6F8FD9;

  --border-default: 1px solid #1F2B42;

  --border-active: 1px solid #2B5597;

  --shadow-dropdown: 0 4px 12px rgba(0,0,0,0.4);

}

[data-theme="light"] {

  --color-surface-1: #F0F4FA;

  --color-surface-2: #FFFFFF;

  --color-surface-3: #E4EAF4;

  --color-surface-4: #D0DAF0;

  --color-surface-5: #B8C8E8;

  --color-brand: #2B5597;

  --color-brand-hover: #1A3D7A;

  --color-text-primary: #0E141F;

  --color-text-secondary: #2A3A5C;

  --color-text-tertiary: #4A5A7A;

  --color-text-muted: #6A7A9A;

  --color-success: #1A8A52;

  --color-warning: #A06000;

  --color-error: #C0102E;

  --color-info: #1A4A9A;

  --border-default: 1px solid #C8D4E8;

  --border-active: 1px solid #2B5597;

  --shadow-dropdown: 0 4px 12px rgba(0,0,0,0.15);

}

Every color reference in every component must use these 

CSS variables — no hardcoded hex values anywhere in 

component files.

### 3. Theme Toggle Component

Create a reusable ThemeToggle component in 

components/ThemeToggle.jsx:

- Calls useTheme() to get current theme and toggle function

- Renders a single icon button — no text label

- Dark mode active: shows a sun icon (switch to light)

- Light mode active: shows a moon icon (switch to dark)

- Button styling uses CSS variables:

  - Size: 32px square

  - border-radius: var(--border-radius-md)

  - bg: transparent

  - Icon color: var(--color-text-tertiary)

  - Hover: bg var(--color-surface-4), 

    icon color var(--color-text-primary)

- Smooth transition on all color changes: 

  transition: background-color 0.2s ease, color 0.2s ease

- Add transition: 0.2s ease to :root as well so the 

  entire theme swap animates smoothly rather than 

  snapping instantly

### 4. Header Placement

In the Header component, place ThemeToggle immediately 

to the LEFT of the existing language globe icon button.

Both icons sit in a row with 4px gap, right-aligned 

before the avatar.

---

## LIGHT MODE VISUAL NOTES

In light mode the app should feel like a professional 

enterprise dashboard — clean white surfaces, navy text, 

same brand blue. Not a consumer app — keep it sharp 

and data-focused.

Status badges in light mode:

- Critical: bg rgba(192,16,46,0.1), border #C0102E, 

  text #C0102E

- Warning: bg rgba(160,96,0,0.1), border #A06000, 

  text #A06000

- Active/Success: bg rgba(26,138,82,0.1), border #1A8A52, 

  text #1A8A52

The H&P logo changes the color to #1a1a1a in light mode.

---

Apply to all screens. Keep all existing functionality 

and layout exactly as-is.