import { Box, Flex, Text } from '@chakra-ui/react';
import { dashboardSummarySchema } from '@proletariat-hub/contracts';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';

import { MutedCaption } from '../components/shared/MutedCaption';
import { useAuth } from '../features/auth/useAuth';
import { apiJsonValidated } from '../lib/api';
import { AppPath } from '../lib/appPaths';
import { DashboardInlineRouterLink } from './components/DashboardInlineRouterLink';
import { DashboardWidget } from './components/DashboardWidget';
import { dashboardTheme } from './dashboardTheme';
import { DashboardSidebarNav } from './sidebar/DashboardSidebarNav';
import { DashboardTopBar } from './top-bar/DashboardTopBar';
import { DashboardApiResource } from './utils/dashboardApiPaths';
import { DashboardCopy } from './utils/dashboardCopy';
import { dashboardQueryKeys } from './utils/dashboardQueryKeys';
import {
  formatHubHouseholdWidgetTitle,
  formatPersonalShoppingWidgetTitle,
} from './utils/dashboardTitles';
import { filterUrgentShoppingItems } from './utils/shoppingDisplay';
import { DashboardChoresTodosWidget } from './widgets/chores-and-todos/DashboardChoresTodosWidget';
import { DashboardComradesStrip } from './widgets/comrades/DashboardComradesStrip';
import { DashboardDocsWidget } from './widgets/docs/DashboardDocsWidget';
import { DashboardMediaServicesGrid } from './widgets/media-services/DashboardMediaServicesGrid';
import { DashboardRemindersWidget } from './widgets/reminders/DashboardRemindersWidget';
import { DashboardShoppingWidgetBody } from './widgets/shopping/DashboardShoppingWidgetBody';
import { DashboardUrgentShoppingBody } from './widgets/urgent-shopping/DashboardUrgentShoppingBody';

export function DashboardPage() {
  const { authenticatedComrade, logout } = useAuth();
  const summaryQuery = useQuery({
    queryKey: dashboardQueryKeys.summary,
    queryFn: () => apiJsonValidated(DashboardApiResource.Summary, dashboardSummarySchema),
  });
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
      <DashboardSidebarNav
        onLogout={() => {
          void logout();
        }}
      />
      <Flex direction="column" flex={1} minW={0} minH={0}>
        <DashboardTopBar summary={summary} />

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
                <DashboardShoppingWidgetBody items={summary.hubShoppingItems} />
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
                <DashboardUrgentShoppingBody urgentItems={urgentShoppingItems} />
              ) : (
                <MutedCaption text={DashboardCopy.loading} mutedColor={dashboardTheme.meta} />
              )}
            </DashboardWidget>
          </Flex>

          <Flex flex="1.15" minH={0} gap={3} align="stretch">
            <DashboardChoresTodosWidget
              summary={summary}
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
                <DashboardShoppingWidgetBody items={summary.personalShoppingItems} />
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
              <DashboardRemindersWidget
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
              <DashboardMediaServicesGrid />
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
              <DashboardDocsWidget docsPreview={summary?.docsPreview} />
            </DashboardWidget>
          </Flex>

          <DashboardComradesStrip comrades={summary?.comrades} />
        </Flex>
      </Flex>
    </Flex>
  );
}
