import { Box, Flex, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router';

import { GreetingBar } from '@/components/layout/GreetingBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardInlineRouterLink } from '@/components/ui/DashboardInlineRouterLink';
import { DashboardWidget } from '@/components/ui/DashboardWidget';
import { MutedCaption } from '@/components/ui/MutedCaption';
import { ChoresAndTodosWidget } from '@/components/widgets/ChoresAndTodosWidget';
import { ComradesBar } from '@/components/widgets/ComradesBar';
import { DocsWidget } from '@/components/widgets/DocsWidget';
import { MediaWidget } from '@/components/widgets/MediaWidget';
import { RemindersWidget } from '@/components/widgets/RemindersWidget';
import { ShoppingListWidget } from '@/components/widgets/ShoppingListWidget';
import { UrgentItemsWidget } from '@/components/widgets/UrgentItemsWidget';
import { useAuth } from '@/features/auth/useAuth';
import { DashboardCopy } from '@/features/dashboard/dashboardCopy';
import {
  formatHubHouseholdWidgetTitle,
  formatPersonalShoppingWidgetTitle,
} from '@/features/dashboard/dashboardTitles';
import { useDashboardSummary } from '@/features/dashboard/useDashboard';
import { filterUrgentShoppingItems } from '@/features/shopping/shoppingDisplay';
import { AppPath } from '@/lib/appPaths';
import { dashboardTheme } from '@/styles/dashboardTheme';

export default function DashboardPage(): React.ReactElement {
  const { authenticatedComrade, logout } = useAuth();
  const summaryQuery = useDashboardSummary();
  const summary = summaryQuery.data ?? null;

  useEffect(() => {
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const previousHtmlOverflow = htmlElement.style.overflow;
    const previousBodyOverflow = bodyElement.style.overflow;
    htmlElement.style.overflow = 'hidden';
    bodyElement.style.overflow = 'hidden';
    return () => {
      htmlElement.style.overflow = previousHtmlOverflow;
      bodyElement.style.overflow = previousBodyOverflow;
    };
  }, []);

  const loadSummary = useCallback(async () => {
    await summaryQuery.refetch();
  }, [summaryQuery]);

  const urgentShoppingItems = useMemo(() => {
    if (!summary) {
      return [];
    }
    const combined = [...summary.hubShoppingItems, ...summary.personalShoppingItems];
    return filterUrgentShoppingItems(combined);
  }, [summary]);

  if (!authenticatedComrade) {
    return <Navigate to={AppPath.Login} replace />;
  }
  if (authenticatedComrade.mustChangePassword) {
    return <Navigate to={AppPath.ChangePassword} replace />;
  }
  if (authenticatedComrade.isAdmin && !authenticatedComrade.hasCompletedSetup) {
    return <Navigate to={AppPath.Setup} replace />;
  }

  return (
    <Flex h="100vh" w="100%" overflow="hidden" bg={dashboardTheme.mainChromeBg}>
      <Sidebar
        onLogout={() => {
          void logout();
        }}
      />
      <Flex direction="column" flex={1} minW={0} minH={0}>
        <GreetingBar summary={summary} />

        <Flex direction="column" flex={1} minH={0} p={3} gap={3} bg={dashboardTheme.mainBg}>
          {summaryQuery.error ? (
            <Text fontSize="10px" color="red.600" flexShrink={0}>
              {summaryQuery.error instanceof Error
                ? summaryQuery.error.message
                : DashboardCopy.dashboardLoadError}
            </Text>
          ) : null}

          <Flex flex="1.15" minH={0} gap={3} align="stretch">
            <DashboardWidget
              title={formatHubHouseholdWidgetTitle(summary?.hubName)}
              action={
                <DashboardInlineRouterLink to={AppPath.Shopping} fontSize="10px">
                  {DashboardCopy.householdAddList}
                </DashboardInlineRouterLink>
              }
              flex="2"
            >
              {summary ? (
                <ShoppingListWidget items={summary.hubShoppingItems} />
              ) : (
                <MutedCaption text={DashboardCopy.loading} mutedColor={dashboardTheme.meta} />
              )}
            </DashboardWidget>
            <DashboardWidget
              title={DashboardCopy.urgentWidgetTitle}
              action={
                <DashboardInlineRouterLink to={AppPath.Shopping} fontSize="10px">
                  {DashboardCopy.urgentViewAll}
                </DashboardInlineRouterLink>
              }
              flex="1"
            >
              {summary ? (
                <UrgentItemsWidget urgentItems={urgentShoppingItems} />
              ) : (
                <MutedCaption text={DashboardCopy.loading} mutedColor={dashboardTheme.meta} />
              )}
            </DashboardWidget>
          </Flex>

          <Flex flex="1.15" minH={0} gap={3} align="stretch">
            <ChoresAndTodosWidget
              chores={summary?.choresAssigned}
              todos={summary?.todosAssigned}
              comrades={summary?.comrades ?? []}
              authenticatedComrade={authenticatedComrade}
              onRefresh={loadSummary}
            />
            <DashboardWidget
              title={formatPersonalShoppingWidgetTitle(authenticatedComrade.username)}
              action={
                <DashboardInlineRouterLink to={AppPath.Shopping} fontSize="10px">
                  {DashboardCopy.personalAddItem}
                </DashboardInlineRouterLink>
              }
              flex="1"
            >
              {summary ? (
                <ShoppingListWidget items={summary.personalShoppingItems} />
              ) : (
                <MutedCaption text={DashboardCopy.loading} mutedColor={dashboardTheme.meta} />
              )}
            </DashboardWidget>
          </Flex>

          <Flex flex="1" minH={0} gap={3} align="stretch">
            <DashboardWidget
              title={DashboardCopy.remindersWidgetTitle}
              action={<Box fontSize="9px">{DashboardCopy.remindersAdd}</Box>}
              flex="1"
            >
              <RemindersWidget
                reminders={summary?.calendarPreview}
                comrades={summary?.comrades ?? []}
                onRefresh={loadSummary}
              />
            </DashboardWidget>
            <DashboardWidget
              title={DashboardCopy.mediaServicesWidgetTitle}
              action={
                <DashboardInlineRouterLink to={AppPath.Docs} fontSize="9px">
                  {DashboardCopy.mediaManage}
                </DashboardInlineRouterLink>
              }
              flex="1"
            >
              <MediaWidget />
            </DashboardWidget>
            <DashboardWidget
              title={DashboardCopy.docsWidgetTitle}
              action={
                <DashboardInlineRouterLink to={AppPath.Docs} fontSize="9px">
                  {DashboardCopy.docsViewAll}
                </DashboardInlineRouterLink>
              }
              flex="1"
            >
              <DocsWidget docsPreview={summary?.docsPreview} />
            </DashboardWidget>
          </Flex>

          <ComradesBar comrades={summary?.comrades} />
        </Flex>
      </Flex>
    </Flex>
  );
}
