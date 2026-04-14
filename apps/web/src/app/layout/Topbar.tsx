import { Box, Flex, HStack, IconButton, Link, Text, useDisclosure } from '@chakra-ui/react';
import { ComradeSettingsDrawer } from '@proletariat-hub/web/features';
import { useAuth } from '@proletariat-hub/web/shared/hooks';
import { ThemeToggleButton } from '@proletariat-hub/web/shared/ui';
import { LogOut, Settings } from 'lucide-react';
import { type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

export const TOPBAR_HEIGHT = '16';
export const TOPBAR_BLOCK_SIZE = '4rem';

export function Topbar(): ReactElement {
  const navigate = useNavigate();
  const { comrade, deleteOneLoginSessionMutation } = useAuth();
  const settingsDrawer = useDisclosure();

  const dateLabel: string = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const onLogout = (): void => {
    deleteOneLoginSessionMutation.mutate(undefined, {
      onSuccess: () => {
        void navigate('/login');
      },
    });
  };

  return (
    <Box position="fixed" top="0" left="0" right="0" zIndex="sticky">
      <Flex
        as="header"
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
          {comrade ? (
            <>
              <IconButton
                type="button"
                aria-label="Open comrade settings"
                variant="ghost"
                size="sm"
                color="text.tertiary"
                borderRadius="full"
                borderWidth="1px"
                borderColor="border.secondary"
                onClick={settingsDrawer.onOpen}
              >
                <Settings size={18} />
              </IconButton>
              <ComradeSettingsDrawer
                comrade={comrade}
                isOpen={settingsDrawer.open}
                onClose={settingsDrawer.onClose}
              />
            </>
          ) : null}
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
    </Box>
  );
}
