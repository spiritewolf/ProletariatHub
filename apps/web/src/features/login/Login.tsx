import { Button, Field, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComradeOnboardStatus } from '@proletariat-hub/types';
import { useAuth } from '@proletariat-hub/web/shared/hooks';
import { AuthFlowCard, AuthFlowWrapper } from '@proletariat-hub/web/shared/ui';
import { TRPCClientError } from '@trpc/client';
import { ArrowRight } from 'lucide-react';
import type { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, useSearchParams } from 'react-router-dom';

import { loginFormSchema, type LoginFormState } from './types';

function formatLoginMutationError(error: unknown): string | null {
  if (error instanceof TRPCClientError) {
    // TRPCClientError.data is untyped at the client boundary; only `code` is read here.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- intentional read of tRPC error payload
    if (error.data?.code === 'UNAUTHORIZED') {
      return 'Invalid username or password';
    }
    return 'Cannot reach the hub server. Start the API or check your connection, then try again.';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return null;
}

export function Login(): ReactElement {
  const { createOneLoginSessionMutation, findUniqueComradeFromSessionQuery } = useAuth();
  const [searchParams] = useSearchParams();

  const { handleSubmit, register } = useForm<LoginFormState>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: '', password: '' },
  });

  const loginErrorMessage = formatLoginMutationError(createOneLoginSessionMutation.error);

  const loaderUnreachable =
    searchParams.get('reason') === 'api_unreachable'
      ? 'Cannot reach the hub server. Start the API or check your connection, then try again.'
      : null;

  const sessionProbeUnreachable = findUniqueComradeFromSessionQuery.isError
    ? 'Cannot reach the hub server. Start the API or check your connection, then try again.'
    : null;

  const unreachableBanner = loaderUnreachable ?? sessionProbeUnreachable;

  const onSubmit = handleSubmit((formValues) => {
    createOneLoginSessionMutation.mutate({
      username: formValues.username,
      password: formValues.password,
    });
  });

  const loginRedirectPath =
    createOneLoginSessionMutation.isSuccess && createOneLoginSessionMutation.data
      ? createOneLoginSessionMutation.data.onboardStatus === ComradeOnboardStatus.COMPLETE
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
        <Text textStyle="helperText" mb={6} lineHeight="tall">
          Use your username and password to rejoin the Hub.
        </Text>
        <form onSubmit={onSubmit}>
          <Stack gap={5}>
            {unreachableBanner ? (
              <Text color="status.error" fontSize="sm" role="alert">
                {unreachableBanner}
              </Text>
            ) : null}
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
              <Text color="status.error" fontSize="sm" role="alert">
                {loginErrorMessage}
              </Text>
            ) : null}
            <Button type="submit" size="lg" width="full" variant="solid">
              {createOneLoginSessionMutation.isPending ? (
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
