import { Flex, HStack, IconButton, Link, Text } from '@chakra-ui/react';
import { useAuth } from '@proletariat-hub/web/shared/hooks/auth/useAuth';
import { ThemeToggleButton } from '@proletariat-hub/web/shared/ui';
import { LogOut } from 'lucide-react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

export const TOPBAR_HEIGHT = '16';
export const TOPBAR_BLOCK_SIZE = '4rem';

export function Topbar(): ReactElement {
  const navigate = useNavigate();
  const { logoutMutation } = useAuth();

  const dateLabel: string = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const onLogout = (): void => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        void navigate('/login');
      },
    });
  };

  return (
    <Flex
      as="header"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex="sticky"
      h={TOPBAR_HEIGHT}
      px={{ base: '4', md: '6' }}
      align="center"
      justify="space-between"
      bg="topbar.primary"
      color="text.tertiary"
    >
      <Link href="/" color="text.tertiary">
        Proletariat Hub
      </Link>
      <HStack gap="3">
        <IconButton
          type="button"
          aria-label="Log out"
          variant="ghost"
          size="sm"
          color="text.tertiary"
          onClick={onLogout}
        >
          <LogOut size={18} />
        </IconButton>
        <ThemeToggleButton />
        <Text fontSize="sm" opacity={0.9}>
          {dateLabel}
        </Text>
      </HStack>
    </Flex>
  );
}
