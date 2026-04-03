import { Button, Field, Flex, Input, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCredentialBodySchema } from '@proletariat-hub/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { DashboardListRow } from '@/components/ui/DashboardListRow';
import { DashboardWidget } from '@/components/ui/DashboardWidget';
import { dashboardTheme } from '@/styles/dashboardTheme';

import { DocsPageCopy } from './docsCopy';
import { formatCredentialMeta } from './docsDisplay';
import {
  docsCredentialFormDefaults,
  docsCredentialFormSchema,
  type DocsCredentialFormValues,
} from './docsFormSchemas';
import { docsFieldLabelProps, docsInputStyles } from './docsFormStyles';
import { docsQueryKeys } from './docsQueryKeys';
import { useDocs } from './useDocs';

type DocsCredentialsTabProps = {
  onBanner: (message: string | null) => void;
};

export function DocsCredentialsTab({ onBanner }: DocsCredentialsTabProps): React.ReactElement {
  const queryClient = useQueryClient();
  const {
    fetchCredentials,
    createCredential,
    revealCredential,
    deleteCredential: deleteCredentialFromApi,
  } = useDocs();
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DocsCredentialFormValues>({
    resolver: zodResolver(docsCredentialFormSchema),
    defaultValues: docsCredentialFormDefaults,
  });

  const credentialsQuery = useQuery({
    queryKey: docsQueryKeys.credentials,
    queryFn: fetchCredentials,
  });

  const createCredentialMutation = useMutation({
    mutationFn: createCredential,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: docsQueryKeys.credentials });
    },
  });

  const deleteCredentialMutation = useMutation({
    mutationFn: deleteCredentialFromApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: docsQueryKeys.credentials });
    },
  });

  useEffect(() => {
    if (credentialsQuery.error) {
      onBanner(
        credentialsQuery.error instanceof Error
          ? credentialsQuery.error.message
          : DocsPageCopy.loadError,
      );
      return;
    }
    if (credentialsQuery.isSuccess) {
      onBanner(null);
    }
  }, [credentialsQuery.error, credentialsQuery.isSuccess, onBanner]);

  const onSubmit = handleSubmit(async (data) => {
    const parsed = createCredentialBodySchema.safeParse({
      label: data.label,
      username: data.username.trim().length > 0 ? data.username.trim() : undefined,
      secretPlain: data.secretPlain,
      urlOrApp: data.urlOrApp.trim().length > 0 ? data.urlOrApp.trim() : undefined,
      notesPlain: data.notesPlain.trim().length > 0 ? data.notesPlain.trim() : undefined,
    });
    if (!parsed.success) {
      onBanner(parsed.error.issues[0]?.message ?? 'Invalid');
      return;
    }
    onBanner(null);
    try {
      await createCredentialMutation.mutateAsync({
        label: parsed.data.label,
        username: parsed.data.username,
        secretPlain: parsed.data.secretPlain,
        urlOrApp: parsed.data.urlOrApp,
        notesPlain: parsed.data.notesPlain,
      });
      reset(docsCredentialFormDefaults);
    } catch (err) {
      onBanner(err instanceof Error ? err.message : DocsPageCopy.loadError);
    }
  });

  const copySecret = async (id: string) => {
    onBanner(null);
    setCopyingId(id);
    try {
      const secretPlain = await revealCredential(id);
      await navigator.clipboard.writeText(secretPlain);
    } catch (err) {
      onBanner(err instanceof Error ? err.message : DocsPageCopy.loadError);
    } finally {
      setCopyingId(null);
    }
  };

  const deleteCredential = async (id: string) => {
    onBanner(null);
    setDeletingId(id);
    try {
      await deleteCredentialMutation.mutateAsync(id);
    } catch (err) {
      onBanner(err instanceof Error ? err.message : DocsPageCopy.loadError);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardWidget title={DocsPageCopy.tabPasswords} flexShrink={0}>
      <form onSubmit={onSubmit}>
        <Stack gap={2}>
          <Field.Root invalid={!!errors.label}>
            <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.credLabel}</Field.Label>
            <Input size="sm" {...docsInputStyles} h="32px" {...register('label')} />
            {errors.label?.message ? (
              <Text fontSize="8px" color="red.600" mt={0.5}>
                {errors.label.message}
              </Text>
            ) : null}
          </Field.Root>
          <Field.Root>
            <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.credUsername}</Field.Label>
            <Input size="sm" {...docsInputStyles} h="32px" {...register('username')} />
          </Field.Root>
          <Field.Root invalid={!!errors.secretPlain}>
            <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.credSecret}</Field.Label>
            <Input
              type="password"
              size="sm"
              {...docsInputStyles}
              h="32px"
              autoComplete="off"
              {...register('secretPlain')}
            />
            {errors.secretPlain?.message ? (
              <Text fontSize="8px" color="red.600" mt={0.5}>
                {errors.secretPlain.message}
              </Text>
            ) : null}
          </Field.Root>
          <Field.Root>
            <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.credUrl}</Field.Label>
            <Input size="sm" {...docsInputStyles} h="32px" {...register('urlOrApp')} />
          </Field.Root>
          <Field.Root>
            <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.credNotes}</Field.Label>
            <Input size="sm" {...docsInputStyles} h="32px" {...register('notesPlain')} />
          </Field.Root>
          <Button
            type="submit"
            size="xs"
            fontSize="9px"
            bg={dashboardTheme.title}
            color="white"
            loading={isSubmitting || createCredentialMutation.isPending}
          >
            {DocsPageCopy.credAdd}
          </Button>
        </Stack>
      </form>
      {credentialsQuery.isLoading ? (
        <Text fontSize="9px" color={dashboardTheme.meta} mt={3}>
          {DocsPageCopy.loading}
        </Text>
      ) : (credentialsQuery.data ?? []).length === 0 ? (
        <Text fontSize="9px" color={dashboardTheme.meta} mt={3}>
          {DocsPageCopy.credentialsEmpty}
        </Text>
      ) : (
        <Stack gap={1} mt={3}>
          {(credentialsQuery.data ?? []).map((c) => (
            <DashboardListRow
              key={c.id}
              leading={<Text fontSize="10px">🔒</Text>}
              title={c.label}
              meta={formatCredentialMeta(c)}
              trailing={
                <Flex gap={1}>
                  <Button
                    type="button"
                    size="xs"
                    fontSize="8px"
                    h="20px"
                    variant="outline"
                    borderColor={dashboardTheme.cardBorder}
                    loading={copyingId === c.id}
                    onClick={() => void copySecret(c.id)}
                  >
                    {DocsPageCopy.credCopy}
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    fontSize="8px"
                    h="20px"
                    variant="outline"
                    borderColor={dashboardTheme.cardBorder}
                    loading={deletingId === c.id}
                    disabled={deleteCredentialMutation.isPending && deletingId !== c.id}
                    onClick={() => void deleteCredential(c.id)}
                  >
                    {DocsPageCopy.credDelete}
                  </Button>
                </Flex>
              }
            />
          ))}
        </Stack>
      )}
    </DashboardWidget>
  );
}
