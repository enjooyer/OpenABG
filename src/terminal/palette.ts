// ABG palette tokens for CLI/UI theming. Purple/pink theme for Facility Sieben.
// Keep in sync with docs/cli/index.md (CLI palette section).
export const LOBSTER_PALETTE = {
  accent: "#D53F8C",      // Pink (primary ABG color)
  accentBright: "#ED64A6", // Bright pink
  accentDim: "#B83280",   // Deep pink
  info: "#9F7AEA",        // Purple
  success: "#48BB78",     // Green (keep for success states)
  warn: "#ED8936",        // Orange-ish (keep for warnings)
  error: "#E53E3E",       // Red (keep for errors)
  muted: "#A0AEC0",       // Gray-blue
} as const;
