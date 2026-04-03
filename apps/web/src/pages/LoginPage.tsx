import { Button, Code, Field, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { type FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AppPath } from '../appPaths';
import { loginBodySchema } from '@proletariat-hub/contracts';
import { FlowCard, AuthenticationWizard } from '../components/flow/AuthenticationWizard';
import { flowPalette } from '../flow-theme';
import { useAuth } from '../auth/AuthContext';

export function LoginPage() {
  const { login, authenticatedComrade, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (loading) {
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

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const bodyCheck = loginBodySchema.safeParse({ username, password });
    if (!bodyCheck.success) {
      const first = bodyCheck.error.issues[0];
      setError(first?.message ?? 'Check your input');
      return;
    }

    setPending(true);
    try {
      await login(bodyCheck.data.username, bodyCheck.data.password);
      navigate(AppPath.Root, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setPending(false);
    }
  }

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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                borderColor={flowPalette.border}
                _focusVisible={{
                  borderColor: flowPalette.maroon,
                  boxShadow: `0 0 0 1px ${flowPalette.maroon}`,
                }}
              />
            </Field.Root>
            <Field.Root>
              <Field.Label color={flowPalette.text}>Password</Field.Label>
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
