# 0003. Tailwind CSS for styling

- **Status:** Accepted
- **Date:** 2026-10-04
- **Phase:** 1

## Context
We need a responsive, good-looking site with dark mode, without writing a lot of custom CSS.

## Decision
Tailwind CSS v3 (PostCSS plugin) with `darkMode: 'class'`. The theme toggle adds or removes `dark` on `<html>` and remembers the choice in localStorage. The OS preference is the default.

## Alternatives considered
- CSS Modules: more hand-written CSS.
- MUI/Chakra: heavier bundle and a generic look.

## Consequences
- Utility classes live in the JSX. Repeated patterns get pulled into small components or `@apply` classes in `index.css`.
- v3 was chosen over v4 because its config-file setup is stable and well documented.
