import { Box } from '@chakra-ui/react';
import { useState } from 'react';
import type { AuthenticatedComrade, DashboardSummary } from '@proletariat-hub/contracts';
import { MutedCaption } from '../../../components/shared/MutedCaption';
import { DashboardWidget } from '../../components/DashboardWidget';
import { dashboardTheme } from '../../dashboardTheme';
import { DashboardCopy } from '../../utils/dashboardCopy';
import { DashboardWorkTab } from '../../utils/dashboardWorkTab';
import { DashboardChoresTab } from './chores/DashboardChoresTab';
import { DashboardTodosTab } from './todos/DashboardTodosTab';
import { DashboardWorkTabButtons } from './DashboardWorkTabButtons';

type DashboardChoresTodosWidgetProps = {
  summary: DashboardSummary | null;
  authenticatedComrade: AuthenticatedComrade;
  onRefresh: () => Promise<void>;
};

export function DashboardChoresTodosWidget({
  summary,
  authenticatedComrade,
  onRefresh,
}: DashboardChoresTodosWidgetProps) {
  const [workTab, setWorkTab] = useState(DashboardWorkTab.Chores);

  return (
    <DashboardWidget
      title={DashboardCopy.choresTodosWidgetTitle}
      action={
        <Box as="span" fontSize="9px">
          {DashboardCopy.choresTodosAdd}
        </Box>
      }
      flex="1"
    >
      <DashboardWorkTabButtons activeTab={workTab} onTabChange={setWorkTab} />
      {workTab === DashboardWorkTab.Chores ? (
        summary ? (
          <DashboardChoresTab
            chores={summary.choresAssigned}
            comrades={summary.comrades}
            onRefresh={onRefresh}
          />
        ) : (
          <MutedCaption text={DashboardCopy.loading} mutedColor={dashboardTheme.meta} />
        )
      ) : summary ? (
        <DashboardTodosTab
          todos={summary.todosAssigned}
          comrades={summary.comrades}
          currentComradeId={authenticatedComrade.id}
          onRefresh={onRefresh}
        />
      ) : (
        <MutedCaption text={DashboardCopy.loading} mutedColor={dashboardTheme.meta} />
      )}
    </DashboardWidget>
  );
}
