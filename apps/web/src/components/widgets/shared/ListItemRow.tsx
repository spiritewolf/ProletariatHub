import type { ReactNode } from 'react';

import { DashboardListRow } from '../../ui/DashboardListRow';

type ListItemRowProps = {
  leading?: ReactNode;
  title: string;
  meta: string;
  trailing?: ReactNode;
};

export function ListItemRow({
  leading,
  title,
  meta,
  trailing,
}: ListItemRowProps): React.ReactElement {
  return <DashboardListRow leading={leading} title={title} meta={meta} trailing={trailing} />;
}
