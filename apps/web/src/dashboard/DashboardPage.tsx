import { Box, Flex, Text } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { dashboardSummarySchema, type DashboardSummary } from '@proletariat-hub/contracts';
import { AppPath } from '../appPaths';
import { apiJsonValidated } from '../api';
import { useAuth } from '../auth/AuthContext';
import { MutedCaption } from '../components/shared/MutedCaption';
import { DashboardApiResource } from './utils/dashboardApiPaths';
import { DashboardCopy } from './utils/dashboardCopy';
import {
  formatHubHouseholdWidgetTitle,
  formatPersonalShoppingWidgetTitle,
} from './utils/dashboardTitles';
import { filterUrgentShoppingItems } from './utils/shoppingDisplay';
import { dashboardTheme } from './dashboardTheme';
import { DashboardInlineRouterLink } from './components/DashboardInlineRouterLink';
import { DashboardWidget } from './components/DashboardWidget';
import { DashboardSidebarNav } from './sidebar/DashboardSidebarNav';
import { DashboardTopBar } from './top-bar/DashboardTopBar';
import { DashboardChoresTodosWidget } from './widgets/chores-and-todos/DashboardChoresTodosWidget';
import { DashboardComradesStrip } from './widgets/comrades/DashboardComradesStrip';
import { DashboardMediaServicesGrid } from './widgets/media-services/DashboardMediaServicesGrid';
import { DashboardShoppingWidgetBody } from './widgets/shopping/DashboardShoppingWidgetBody';
import { DashboardUrgentShoppingBody } from './widgets/urgent-shopping/DashboardUrgentShoppingBody';

export function DashboardPage() {
  const { authenticatedComrade, logout } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

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
    try {
      const data = await apiJsonValidated(DashboardApiResource.Summary, dashboardSummarySchema);
      setSummary(data);
      setLoadError(null);
    } catch (error: unknown) {
      setLoadError(
        error instanceof Error ? error.message : DashboardCopy.dashboardLoadError,
      );
    }
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

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
          {loadError ? (
            <Text fontSize="10px" color="red.600" flexShrink={0}>
              {loadError}
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
              <MutedCaption text={DashboardCopy.remindersPlaceholder} mutedColor={dashboardTheme.meta} />
            </DashboardWidget>
            <DashboardWidget
              title={DashboardCopy.mediaServicesWidgetTitle}
              action={
                <Box fontSize="9px" _hover={{ cursor: 'default' }}>
                  {DashboardCopy.mediaManage}
                </Box>
              }
              flex="1"
            >
              <DashboardMediaServicesGrid />
            </DashboardWidget>
            <DashboardWidget
              title={DashboardCopy.docsWidgetTitle}
              action={
                <Box fontSize="9px" _hover={{ cursor: 'default' }}>
                  {DashboardCopy.docsViewAll}
                </Box>
              }
              flex="1"
            >
              <MutedCaption text={DashboardCopy.docsPlaceholder} mutedColor={dashboardTheme.meta} />
            </DashboardWidget>
          </Flex>

          <DashboardComradesStrip comrades={summary?.comrades} />
        </Flex>
      </Flex>
    </Flex>
  );
}
