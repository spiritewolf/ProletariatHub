import { Box, Text } from '@chakra-ui/react';
import type { DashboardShoppingItemWidget } from '@proletariat-hub/contracts';

import { MutedCaption } from '../../../components/shared/MutedCaption';
import { DashboardListRow } from '../../components/DashboardListRow';
import { DashboardPriorityBadge } from '../../components/DashboardPriorityBadge';
import { dashboardTheme } from '../../dashboardTheme';
import { DashboardCopy } from '../../utils/dashboardCopy';
import {
  DASHBOARD_SHOPPING_KIND_BADGE_BG,
  DASHBOARD_SHOPPING_KIND_BADGE_COLOR,
  DASHBOARD_URGENT_ITEM_DOT_COLOR,
} from '../../utils/dashboardUiTokens';

type DashboardUrgentShoppingBodyProps = {
  urgentItems: DashboardShoppingItemWidget[];
};

export function DashboardUrgentShoppingBody({ urgentItems }: DashboardUrgentShoppingBodyProps) {
  if (urgentItems.length === 0) {
    return (
      <MutedCaption text={DashboardCopy.urgentShoppingEmpty} mutedColor={dashboardTheme.meta} />
    );
  }

  return (
    <>
      {urgentItems.map((item) => (
        <DashboardListRow
          key={item.id}
          leading={
            <Box
              w="10px"
              h="10px"
              borderRadius="full"
              bg={DASHBOARD_URGENT_ITEM_DOT_COLOR}
              flexShrink={0}
            />
          }
          title={item.name}
          meta={item.listName}
          trailing={
            <>
              <Text
                as="span"
                fontSize="8px"
                bg={DASHBOARD_SHOPPING_KIND_BADGE_BG}
                color={DASHBOARD_SHOPPING_KIND_BADGE_COLOR}
                px={1}
                py={0.5}
                borderRadius="sm"
                whiteSpace="nowrap"
              >
                {DashboardCopy.shoppingKindBadge}
              </Text>
              <DashboardPriorityBadge priority={item.priority} />
            </>
          }
        />
      ))}
    </>
  );
}
