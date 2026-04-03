import { dashboardTheme } from './dashboard/dashboardTheme';

/**
 * Auth & setup flows — aliases dashboard mockup tokens so every surface stays consistent.
 * (Extended tokens like maroonSoft / error are flow-only.)
 */
export const flowPalette = {
  maroon: dashboardTheme.title,
  maroonDark: '#5c0f24',
  maroonSoft: '#a33b56',
  pageBg: dashboardTheme.mainChromeBg,
  cardBg: dashboardTheme.cardBg,
  text: dashboardTheme.text,
  muted: dashboardTheme.meta,
  border: dashboardTheme.cardBorder,
  progressEmpty: dashboardTheme.cardBorder,
  progressFill: dashboardTheme.title,
  error: '#b91c1c',
} as const;
