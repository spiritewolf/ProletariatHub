import { Button, Code, Field, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginBodySchema, LoginFormState } from '@proletariat-hub/contracts';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router-dom';

import { AppPath } from '../appPaths';
import { useAuth } from '../auth/AuthContext';
import { AuthenticationWizard, FlowCard } from '../components/flow/AuthenticationWizard';
import { flowPalette } from '../flow-theme';

export function LoginPage() {
  const { login, authenticatedComrade, isLoading } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const formMethods = useForm<LoginFormState>({
    resolver: zodResolver(loginBodySchema),
    defaultValues: { username: '', password: '' },
  });
  const { handleSubmit } = formMethods;

  if (isLoading) {
    return (
      <AuthenticationWizard subtitle="the household collective" progressFill={0}>
        <FlowCard>
          <Text color={flowPalette.muted}>Loading…</Text>
        </FlowCard>
      </AuthenticationWizard>
    );
  }
  if (authenticatedComrade) {
    return <Navigate to={AppPath.Root} replace />;
  }

  const onSubmit = handleSubmit(async (data) => {
    const dataValidation = loginBodySchema.safeParse(data);

    if (!dataValidation.success) {
      setError(
        dataValidation.error.issues[0]?.message ?? 'There was an issue submitting your login.',
      );
      return;
    }

    setPending(true);
    try {
      await login(dataValidation.data.username, dataValidation.data.password);
      await navigate(AppPath.Root, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setPending(false);
    }
  });

  return (
    <AuthenticationWizard subtitle="the household collective" progressFill={0}>
      <FlowCard>
        <Text
          fontSize="xs"
          fontWeight="semibold"
          letterSpacing="0.12em"
          color={flowPalette.maroon}
          mb={4}
        >
          ★ WELCOME BACK
        </Text>
        <Heading as="h2" size="xl" mb={3} color={flowPalette.text}>
          Sign in, Comrade
        </Heading>
        <Text color={flowPalette.muted} mb={6} fontSize="sm" lineHeight="tall">
          The collective remembers you. Use your username and password to rejoin the Hub.
        </Text>
        <form onSubmit={onSubmit}>
          <Stack gap={5}>
            <Field.Root>
              <Field.Label color={flowPalette.text}>Username</Field.Label>
              <Input
                autoComplete="username"
                required
                borderColor={flowPalette.border}
                _focusVisible={{
                  borderColor: flowPalette.maroon,
                  boxShadow: `0 0 0 1px ${flowPalette.maroon}`,
                }}
                {...formMethods.register('username')}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label color={flowPalette.text}>Password</Field.Label>
              <Input
                type="password"
                autoComplete="current-password"
                required
                borderColor={flowPalette.border}
                _focusVisible={{
                  borderColor: flowPalette.maroon,
                  boxShadow: `0 0 0 1px ${flowPalette.maroon}`,
                }}
                {...formMethods.register('password')}
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
              {pending ? 'Opening the gates…' : 'Enter the Hub →'}
            </Button>
          </Stack>
        </form>
        <Text mt={6} fontSize="xs" color={flowPalette.muted} lineHeight="tall">
          First time? Seed Comrade is <Code fontSize="xs">admin</Code> /{' '}
          <Code fontSize="xs">admin</Code> — you&apos;ll choose a new password next.
        </Text>
      </FlowCard>
    </AuthenticationWizard>
  );
}
