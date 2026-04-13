import { Button, Field, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComradeOnboardStatus } from '@proletariat-hub/web/shared';
import { useAuth } from '@proletariat-hub/web/shared/hooks/auth/useAuth';
import { AuthFlowCard } from '@proletariat-hub/web/shared/ui/auth-flow/AuthFlowCard';
import { AuthFlowWrapper } from '@proletariat-hub/web/shared/ui/auth-flow/AuthFlowWrapper';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';

import { loginFormSchema, type LoginFormState } from './types';

export function Login(): React.ReactElement {
  const { loginMutation } = useAuth();

  const { handleSubmit, register } = useForm<LoginFormState>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: '', password: '' },
  });

  const loginErrorMessage =
    loginMutation.error instanceof Error ? loginMutation.error.message : null;

  const onSubmit = handleSubmit((formValues) => {
    loginMutation.mutate({
      username: formValues.username,
      password: formValues.password,
    });
  });

  const loginRedirectPath =
    loginMutation.isSuccess && loginMutation.data
      ? loginMutation.data.onboardStatus === ComradeOnboardStatus.COMPLETE
        ? '/'
        : '/setup'
      : null;

  if (loginRedirectPath !== null) {
    return <Navigate to={loginRedirectPath} replace />;
  }

  return (
    <AuthFlowWrapper>
      <AuthFlowCard>
        <Text
          fontSize="xs"
          fontWeight="semibold"
          letterSpacing="0.12em"
          color="accent.primary"
          mb={4}
          textTransform="uppercase"
        >
          Your Hub Awaits
        </Text>
        <Heading as="h2" size="xl" mb={3} color="text.primary">
          Welcome, Comrade
        </Heading>
        <Text color="text.secondary" mb={6} fontSize="sm" lineHeight="tall">
          Use your username and password to rejoin the Hub.
        </Text>
        <form onSubmit={onSubmit}>
          <Stack gap={5}>
            <Field.Root>
              <Field.Label color="text.primary">Username</Field.Label>
              <Input autoComplete="username" required {...register('username')} />
            </Field.Root>
            <Field.Root>
              <Field.Label color="text.primary">Password</Field.Label>
              <Input
                type="password"
                autoComplete="current-password"
                required
                {...register('password')}
              />
            </Field.Root>
            {loginErrorMessage ? (
              <Text color="status.error" fontSize="sm">
                {loginErrorMessage}
              </Text>
            ) : null}
            <Button type="submit" size="lg" width="full" variant="solid">
              {loginMutation.isPending ? (
                'Opening the gates…'
              ) : (
                <>
                  Enter the Hub <ArrowRight size={16} aria-hidden style={{ display: 'inline' }} />
                </>
              )}
            </Button>
          </Stack>
        </form>
        <Text mt={6} fontSize="xs" color="text.secondary" lineHeight="tall">
          First time? Use the credentials provided by your admin, you will be able to update these
          after your first login.
        </Text>
      </AuthFlowCard>
    </AuthFlowWrapper>
  );
}
