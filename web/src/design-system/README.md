# Hopenix design system

The design system is token-first. Product surfaces should use semantic variables and the reusable components in `components/` rather than introducing local colors, shadows, radii, or motion values.

Theme selection is controlled by `data-theme="light"` or `data-theme="dark"` on the root element. Without an explicit theme, the system follows the operating system preference. All motion has a reduced-motion fallback, and interactive controls include a shared visible focus ring.
