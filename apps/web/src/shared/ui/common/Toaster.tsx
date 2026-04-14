import {
  createToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  Toaster as ChakraToaster,
} from '@chakra-ui/react';
import type { ReactElement } from 'react';

export type ToastCreateInput = {
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title?: string;
  description?: string;
  duration?: number;
  closable?: boolean;
};

export type HubToaster = {
  create: (input: ToastCreateInput) => void;
};

const store = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
});

export const toaster: HubToaster = {
  create(input: ToastCreateInput): void {
    store.create(input);
  },
};

export function Toaster(): ReactElement {
  return (
    <Portal>
      <ChakraToaster toaster={store} insetInline={{ mdDown: '4' }}>
        {(toast) => (
          <Toast.Root width={{ md: 'sm' }}>
            {toast.type === 'loading' ? (
              <Spinner size="sm" colorPalette="teal" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title ? <Toast.Title>{toast.title}</Toast.Title> : null}
              {toast.description ? (
                <Toast.Description>{toast.description}</Toast.Description>
              ) : null}
            </Stack>
            {toast.action ? <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger> : null}
            {toast.closable ? <Toast.CloseTrigger /> : null}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  );
}
