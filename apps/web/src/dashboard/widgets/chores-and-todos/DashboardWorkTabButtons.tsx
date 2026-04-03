import { Button, Flex } from '@chakra-ui/react';
import { dashboardTheme } from '../../dashboardTheme';
import { DashboardCopy } from '../../utils/dashboardCopy';
import { DashboardWorkTab } from '../../utils/dashboardWorkTab';

type DashboardWorkTabButtonsProps = {
  activeTab: DashboardWorkTab;
  onTabChange: (tab: DashboardWorkTab) => void;
};

export function DashboardWorkTabButtons({ activeTab, onTabChange }: DashboardWorkTabButtonsProps) {
  return (
    <Flex gap={1} mb={2} flexShrink={0}>
      <Button
        type="button"
        size="xs"
        fontSize="9px"
        h="22px"
        variant={activeTab === DashboardWorkTab.Chores ? 'solid' : 'outline'}
        bg={activeTab === DashboardWorkTab.Chores ? dashboardTheme.title : 'transparent'}
        color={activeTab === DashboardWorkTab.Chores ? 'white' : dashboardTheme.title}
        borderColor={dashboardTheme.cardBorder}
        onClick={() => onTabChange(DashboardWorkTab.Chores)}
      >
        {DashboardCopy.workTabChores}
      </Button>
      <Button
        type="button"
        size="xs"
        fontSize="9px"
        h="22px"
        variant={activeTab === DashboardWorkTab.Todos ? 'solid' : 'outline'}
        bg={activeTab === DashboardWorkTab.Todos ? dashboardTheme.title : 'transparent'}
        color={activeTab === DashboardWorkTab.Todos ? 'white' : dashboardTheme.title}
        borderColor={dashboardTheme.cardBorder}
        onClick={() => onTabChange(DashboardWorkTab.Todos)}
      >
        {DashboardCopy.workTabTodos}
      </Button>
    </Flex>
  );
}
