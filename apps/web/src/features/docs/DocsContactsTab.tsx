import { Button, Field, Input, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { createContactBodySchema } from '@proletariat-hub/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { DashboardListRow } from '@/components/ui/DashboardListRow';
import { DashboardWidget } from '@/components/ui/DashboardWidget';
import { dashboardTheme } from '@/styles/dashboardTheme';

import { DocsPageCopy } from './docsCopy';
import { formatContactMeta } from './docsDisplay';
import {
  docsContactFormDefaults,
  docsContactFormSchema,
  type DocsContactFormValues,
} from './docsFormSchemas';
import { docsFieldLabelProps, docsInputStyles } from './docsFormStyles';
import { splitCommaList } from './docsFormUtils';
import { docsQueryKeys } from './docsQueryKeys';
import { useDocs } from './useDocs';

type DocsContactsTabProps = {
  onBanner: (message: string | null) => void;
};

export function DocsContactsTab({ onBanner }: DocsContactsTabProps): React.ReactElement {
  const queryClient = useQueryClient();
  const { fetchContacts, createContact, deleteContact: deleteContactFromApi } = useDocs();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DocsContactFormValues>({
    resolver: zodResolver(docsContactFormSchema),
    defaultValues: docsContactFormDefaults,
  });

  const contactsQuery = useQuery({
    queryKey: docsQueryKeys.contacts,
    queryFn: fetchContacts,
  });

  const createContactMutation = useMutation({
    mutationFn: createContact,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: docsQueryKeys.contacts });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: deleteContactFromApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: docsQueryKeys.contacts });
    },
  });

  useEffect(() => {
    if (contactsQuery.error) {
      onBanner(
        contactsQuery.error instanceof Error ? contactsQuery.error.message : DocsPageCopy.loadError,
      );
      return;
    }
    if (contactsQuery.isSuccess) {
      onBanner(null);
    }
  }, [contactsQuery.error, contactsQuery.isSuccess, onBanner]);

  const onSubmit = handleSubmit(async (data) => {
    const parsed = createContactBodySchema.safeParse({
      name: data.name,
      category: data.category.trim().length > 0 ? data.category.trim() : undefined,
      phones: splitCommaList(data.phonesComma),
      emails: splitCommaList(data.emailsComma),
      address: data.address.trim().length > 0 ? data.address.trim() : undefined,
      notes: data.notes.trim().length > 0 ? data.notes.trim() : undefined,
    });
    if (!parsed.success) {
      onBanner(parsed.error.issues[0]?.message ?? 'Invalid');
      return;
    }
    onBanner(null);
    try {
      await createContactMutation.mutateAsync({
        name: parsed.data.name,
        category: parsed.data.category,
        phones: parsed.data.phones,
        emails: parsed.data.emails,
        address: parsed.data.address,
        notes: parsed.data.notes,
      });
      reset(docsContactFormDefaults);
    } catch (err) {
      onBanner(err instanceof Error ? err.message : DocsPageCopy.loadError);
    }
  });

  const deleteContact = async (id: string) => {
    onBanner(null);
    setDeletingId(id);
    try {
      await deleteContactMutation.mutateAsync(id);
    } catch (err) {
      onBanner(err instanceof Error ? err.message : DocsPageCopy.loadError);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardWidget title={DocsPageCopy.tabContacts} flexShrink={0}>
      <form onSubmit={onSubmit}>
        <Stack gap={2}>
          <Field.Root invalid={!!errors.name}>
            <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.contactName}</Field.Label>
            <Input size="sm" {...docsInputStyles} h="32px" {...register('name')} />
            {errors.name?.message ? (
              <Text fontSize="8px" color="red.600" mt={0.5}>
                {errors.name.message}
              </Text>
            ) : null}
          </Field.Root>
          <Field.Root>
            <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.contactPhones}</Field.Label>
            <Input size="sm" {...docsInputStyles} h="32px" {...register('phonesComma')} />
          </Field.Root>
          <Field.Root>
            <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.contactEmails}</Field.Label>
            <Input size="sm" {...docsInputStyles} h="32px" {...register('emailsComma')} />
          </Field.Root>
          <Field.Root>
            <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.contactCategory}</Field.Label>
            <Input size="sm" {...docsInputStyles} h="32px" {...register('category')} />
          </Field.Root>
          <Field.Root>
            <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.contactAddress}</Field.Label>
            <Input size="sm" {...docsInputStyles} h="32px" {...register('address')} />
          </Field.Root>
          <Field.Root>
            <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.contactNotes}</Field.Label>
            <Input size="sm" {...docsInputStyles} h="32px" {...register('notes')} />
          </Field.Root>
          <Button
            type="submit"
            size="xs"
            fontSize="9px"
            bg={dashboardTheme.title}
            color="white"
            loading={isSubmitting || createContactMutation.isPending}
          >
            {DocsPageCopy.contactAdd}
          </Button>
        </Stack>
      </form>
      {contactsQuery.isLoading ? (
        <Text fontSize="9px" color={dashboardTheme.meta} mt={3}>
          {DocsPageCopy.loading}
        </Text>
      ) : (contactsQuery.data ?? []).length === 0 ? (
        <Text fontSize="9px" color={dashboardTheme.meta} mt={3}>
          {DocsPageCopy.contactsEmpty}
        </Text>
      ) : (
        <Stack gap={1} mt={3}>
          {(contactsQuery.data ?? []).map((c) => (
            <DashboardListRow
              key={c.id}
              leading={<Text fontSize="10px">✆</Text>}
              title={c.name}
              meta={formatContactMeta(c)}
              trailing={
                <Button
                  type="button"
                  size="xs"
                  fontSize="8px"
                  h="20px"
                  variant="outline"
                  borderColor={dashboardTheme.cardBorder}
                  loading={deletingId === c.id}
                  disabled={deleteContactMutation.isPending && deletingId !== c.id}
                  onClick={() => void deleteContact(c.id)}
                >
                  {DocsPageCopy.contactDelete}
                </Button>
              }
            />
          ))}
        </Stack>
      )}
    </DashboardWidget>
  );
}
