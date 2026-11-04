/**
 * shared/src/theme.ts
 * Design tokens shared across all three frontend apps.
 * Import and apply via Tailwind config or CSS variables.
 *
 * TODO:
 *   - Add dark mode variants
 *   - Export as CSS custom properties for non-Tailwind usage
 */

export const theme = {
  colors: {
    // Brand
    primary:   '#000000',    // Uber black
    secondary: '#276EF1',    // Uber blue
    accent:    '#F6C90E',    // Surge yellow

    // Status
    success:   '#05A357',
    warning:   '#FFC043',
    danger:    '#E11900',
    info:      '#1E54B7',

    // Zone type colors (for map overlays)
    zoneColors: {
      residential:   '#4CAF50',
      commercial:    '#2196F3',
      transit_hub:   '#9C27B0',
      entertainment: '#FF5722',
      industrial:    '#795548',
    },

    // Weather
    weatherColors: {
      clear:      '#FFF9C4',
      cloudy:     '#CFD8DC',
      rain:       '#90CAF9',
      heavy_rain: '#1565C0',
      storm:      '#37474F',
    },
  },

  // Congestion heatmap (green → red)
  congestionGradient: ['#00C853', '#FFEB3B', '#FF6D00', '#B71C1C'],
} as const;

