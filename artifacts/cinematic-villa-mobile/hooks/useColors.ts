import { useColorScheme } from "react-native";

import colors from "@/constants/colors";

/**
 * Returns the design tokens for the current color scheme.
 *
 * The returned object contains all color tokens for the active palette
 * plus scheme-independent values like `radius`.
 *
 * Falls back to the light palette when no dark key is defined in
 * constants/colors.ts (the scaffold ships light-only by default).
 * When a sibling web artifact's dark tokens are synced into a `dark`
 * key, this hook will automatically switch palettes based on the
 * device's appearance setting.
 */
type ColorPalette = typeof colors extends { dark: infer D } ? D : never;

export function useColors() {
  const scheme = useColorScheme();
  const hasDark = "dark" in colors;
  const hasLight = "light" in colors;
  const palette: ColorPalette =
    scheme === "dark" && hasDark
      ? (colors as Record<string, ColorPalette>).dark
      : hasLight
        ? (colors as Record<string, ColorPalette>).light
        : (colors as Record<string, ColorPalette>).dark;
  return { ...palette, radius: colors.radius };
}
