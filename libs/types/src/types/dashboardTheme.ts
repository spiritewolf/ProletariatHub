export const DashboardTheme = {
  SYSTEM: 'SYSTEM',
  LIGHT: 'LIGHT',
  DARK: 'DARK',
} as const;
export type DashboardTheme = (typeof DashboardTheme)[keyof typeof DashboardTheme];
