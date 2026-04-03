import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { DashboardWorkTab } from '../../../features/dashboard/dashboardWorkTab';
import { TabRow } from '../../ui/TabRow';

type WorkTabButtonsProps = {
  activeTab: DashboardWorkTab;
  onTabChange: (tab: DashboardWorkTab) => void;
};

const workTabOptions = [
  { value: DashboardWorkTab.Chores, label: DashboardCopy.workTabChores },
  { value: DashboardWorkTab.Todos, label: DashboardCopy.workTabTodos },
] as const;

export function WorkTabButtons({
  activeTab,
  onTabChange,
}: WorkTabButtonsProps): React.ReactElement {
  return <TabRow value={activeTab} options={workTabOptions} mb={2} onChange={onTabChange} />;
}
