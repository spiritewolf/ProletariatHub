import { DashboardCopy } from './dashboardCopy';

export function formatHubHouseholdWidgetTitle(hubName: string | null | undefined): string {
  const displayName =
    hubName != null && hubName.trim().length > 0 ? hubName.trim() : DashboardCopy.hubFallbackName;
  return `${displayName}${DashboardCopy.hubHouseholdSuffix}`;
}

export function formatPersonalShoppingWidgetTitle(username: string): string {
  return `${username}${DashboardCopy.personalShoppingSuffix}`;
}
