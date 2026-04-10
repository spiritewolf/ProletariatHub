import { Button, Field, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFlowCard } from '@proletariat-hub/web/shared/ui/auth-flow/AuthFlowCard';
import { AuthFlowWrapper } from '@proletariat-hub/web/shared/ui/auth-flow/AuthFlowWrapper';
import { ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { loginFormSchema, LoginFormState } from './types';

export function Login(): React.ReactElement {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
    setError,
  } = useForm<LoginFormState>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log('submit');
  });

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
            {errors.root?.message ? (
              <Text color="status.error" fontSize="sm">
                {errors.root.message}
              </Text>
            ) : null}
            <Button
              type="submit"
              //   loading={isSubmitting || isPending}
              size="lg"
              width="full"
              variant="solid"
            >
              {isSubmitting ? (
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
