import { MutedCaption } from '../../../components/ui/MutedCaption';
import { DashboardCopy } from '../../../features/dashboard/dashboardCopy';
import { dashboardTheme } from '../../../styles/dashboardTheme';
import { UrgentItem } from './UrgentItem';
import type { UrgentItemsWidgetProps } from './UrgentItemsWidget.types';

export function UrgentItemsWidget({ urgentItems }: UrgentItemsWidgetProps): React.ReactElement {
  if (urgentItems.length === 0) {
    return (
      <MutedCaption text={DashboardCopy.urgentShoppingEmpty} mutedColor={dashboardTheme.meta} />
    );
  }

  return (
    <>
      {urgentItems.map((item) => (
        <UrgentItem key={item.id} item={item} />
      ))}
    </>
  );
}
