import { Box, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import type { DashboardShoppingItemWidget } from '@proletariat-hub/contracts';
import { MutedCaption } from '../../../components/shared/MutedCaption';
import { DashboardListRow } from '../../components/DashboardListRow';
import { DashboardPriorityBadge } from '../../components/DashboardPriorityBadge';
import { dashboardTheme } from '../../dashboardTheme';
import { DashboardCopy } from '../../utils/dashboardCopy';
import {
  formatShoppingWidgetRowMeta,
  groupDashboardShoppingItemsByCategory,
} from '../../utils/shoppingDisplay';

type DashboardShoppingWidgetBodyProps = {
  items: DashboardShoppingItemWidget[];
};

export function DashboardShoppingWidgetBody({ items }: DashboardShoppingWidgetBodyProps) {
  const categoryGroups = useMemo(() => groupDashboardShoppingItemsByCategory(items), [items]);

  if (items.length === 0) {
    return <MutedCaption text={DashboardCopy.shoppingEmpty} mutedColor={dashboardTheme.meta} />;
  }

  return (
    <Box>
      {categoryGroups.map(({ category, items: groupItems }) => (
        <Box key={category} mb={2}>
          <Text
            fontSize="8px"
            fontWeight="bold"
            color={dashboardTheme.title}
            letterSpacing="0.08em"
            mb={1}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            ★ {category.toUpperCase()}
          </Text>
          {groupItems.map((item) => (
            <DashboardListRow
              key={item.id}
              leading={
                <Box
                  borderRadius="full"
                  borderWidth="1px"
                  borderColor={dashboardTheme.cardBorder}
                  w="12px"
                  h="12px"
                />
              }
              title={item.name}
              meta={formatShoppingWidgetRowMeta(item)}
              trailing={
                <>
                  <DashboardPriorityBadge priority={item.priority} />
                </>
              }
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}
