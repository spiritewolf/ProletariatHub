import { Button, Field, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { accountPatchBodySchema } from '@proletariat-hub/contracts';
import { type FormEvent, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { z } from 'zod';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { PageChromeTopBar } from '@/components/layout/PageChromeTopBar';
import { AuthenticationWizard } from '@/features/auth/flow/AuthenticationWizard';
import { FlowCard } from '@/features/auth/flow/FlowCard';
import { FlowStepLabel } from '@/features/auth/flow/FlowStepLabel';
import { useAuth } from '@/features/auth/useAuth';
import { useChangePassword } from '@/features/auth/useChangePassword';
import { AppPath } from '@/lib/appPaths';
import { flowPalette } from '@/styles/flow-theme';

const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirm: z.string().min(1, 'Confirm your password'),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirm) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match.',
        path: ['confirm'],
      });
    }
  });

export function ChangePasswordPage(): React.ReactElement {
  const { authenticatedComrade, refreshAuthenticatedComrade } = useAuth();
  const { updateAccount } = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState('');
  const [usernameField, setUsernameField] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!authenticatedComrade) {
      return;
    }
    setUsernameField((prev) => (prev === '' ? authenticatedComrade.username : prev));
  }, [authenticatedComrade]);

  if (!authenticatedComrade) {
    return <Navigate to={AppPath.Login} replace />;
  }
  if (!authenticatedComrade.mustChangePassword) {
    return <Navigate to={AppPath.Root} replace />;
  }

  const isAdminOnboarding = authenticatedComrade.isAdmin;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const comrade = authenticatedComrade;
    if (!comrade) {
      return;
    }

    const formParsed = changePasswordFormSchema.safeParse({
      currentPassword,
      newPassword,
      confirm,
    });
    if (!formParsed.success) {
      const first = formParsed.error.issues[0];
      setError(first?.message ?? 'Invalid input');
      return;
    }

    const patchBody: z.infer<typeof accountPatchBodySchema> = {
      currentPassword: formParsed.data.currentPassword,
      newPassword: formParsed.data.newPassword,
    };

    if (isAdminOnboarding) {
      const nextUsername = usernameField.trim();
      if (nextUsername.length > 0 && nextUsername !== comrade.username) {
        patchBody.newUsername = nextUsername;
      }
    }

    const bodyForApi = accountPatchBodySchema.safeParse(patchBody);
    if (!bodyForApi.success) {
      const first = bodyForApi.error.issues[0];
      setError(first?.message ?? 'Invalid input');
      return;
    }

    setPending(true);
    try {
      await updateAccount(bodyForApi.data);
      await refreshAuthenticatedComrade();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setPending(false);
    }
  }

  return (
    <DashboardShell topBar={<PageChromeTopBar title={isAdminOnboarding ? 'Welcome' : 'Account'} />}>
      <AuthenticationWizard
        layout="embedded"
        subtitle="the household collective"
        progressFill={isAdminOnboarding ? 1 : 0}
      >
        <FlowCard>
          {isAdminOnboarding ? <FlowStepLabel step={1} /> : null}
          <Heading as="h2" size="xl" mb={3} color={flowPalette.text}>
            {isAdminOnboarding ? 'Welcome, Comrade' : 'Secure your account'}
          </Heading>
          <Text color={flowPalette.muted} mb={6} fontSize="sm" lineHeight="tall">
            {isAdminOnboarding ? (
              <>
                Let&apos;s build your collective. A <strong>Comrade</strong> is any member of your
                household. Your <strong>Hub</strong> is the household itself.
              </>
            ) : (
              <>
                The revolution starts with good opsec. Set a new password (8+ characters) before you
                join the dashboard.
              </>
            )}
          </Text>
          <form onSubmit={onSubmit}>
            <Stack gap={5}>
              <Field.Root>
                <Field.Label color={flowPalette.text}>Current password</Field.Label>
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  borderColor={flowPalette.border}
                  _focusVisible={{
                    borderColor: flowPalette.maroon,
                    boxShadow: `0 0 0 1px ${flowPalette.maroon}`,
                  }}
                />
                <Field.HelperText color={flowPalette.muted} fontSize="xs">
                  One last time with your existing password — then we move forward.
                </Field.HelperText>
              </Field.Root>
              {isAdminOnboarding ? (
                <Field.Root>
                  <Field.Label color={flowPalette.text}>Your username</Field.Label>
                  <Input
                    autoComplete="username"
                    value={usernameField}
                    onChange={(e) => setUsernameField(e.target.value)}
                    required
                    borderColor={flowPalette.border}
                    _focusVisible={{
                      borderColor: flowPalette.maroon,
                      boxShadow: `0 0 0 1px ${flowPalette.maroon}`,
                    }}
                  />
                </Field.Root>
              ) : null}
              <Field.Root>
                <Field.Label color={flowPalette.text}>
                  {isAdminOnboarding ? 'Set a password' : 'New password'}
                </Field.Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  borderColor={flowPalette.border}
                  _focusVisible={{
                    borderColor: flowPalette.maroon,
                    boxShadow: `0 0 0 1px ${flowPalette.maroon}`,
                  }}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label color={flowPalette.text}>Confirm password</Field.Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={8}
                  borderColor={flowPalette.border}
                  _focusVisible={{
                    borderColor: flowPalette.maroon,
                    boxShadow: `0 0 0 1px ${flowPalette.maroon}`,
                  }}
                />
              </Field.Root>
              {error ? (
                <Text color={flowPalette.error} fontSize="sm">
                  {error}
                </Text>
              ) : null}
              <Button
                type="submit"
                loading={pending}
                bg={flowPalette.maroon}
                color={flowPalette.pageBg}
                _hover={{ bg: flowPalette.maroonDark }}
                size="lg"
                width="full"
              >
                {pending
                  ? 'Saving…'
                  : isAdminOnboarding
                    ? 'Continue the march →'
                    : 'Seized for the collective →'}
              </Button>
            </Stack>
          </form>
        </FlowCard>
      </AuthenticationWizard>
    </DashboardShell>
  );
}
