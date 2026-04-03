import { Button, Field, Flex, Input, Stack, Text, Textarea } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createReferenceNoteBodySchema,
  updateReferenceNoteBodySchema,
} from '@proletariat-hub/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { DashboardListRow } from '@/components/ui/DashboardListRow';
import { DashboardWidget } from '@/components/ui/DashboardWidget';
import { dashboardTheme } from '@/styles/dashboardTheme';

import { DocsPageCopy } from './docsCopy';
import { formatNoteMeta } from './docsDisplay';
import {
  docsNoteFormDefaults,
  docsNoteFormSchema,
  type DocsNoteFormValues,
} from './docsFormSchemas';
import { docsFieldLabelProps, docsInputStyles } from './docsFormStyles';
import { splitCommaList } from './docsFormUtils';
import { docsQueryKeys } from './docsQueryKeys';
import { useDocs } from './useDocs';

type DocsNotesTabProps = {
  onBanner: (message: string | null) => void;
};

export function DocsNotesTab({ onBanner }: DocsNotesTabProps): React.ReactElement {
  const queryClient = useQueryClient();
  const {
    fetchNotes,
    fetchNoteDetail,
    createNote,
    updateNote,
    deleteNote: deleteNoteFromApi,
  } = useDocs();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DocsNoteFormValues>({
    resolver: zodResolver(docsNoteFormSchema),
    defaultValues: docsNoteFormDefaults,
  });

  const notesQuery = useQuery({
    queryKey: docsQueryKeys.notes,
    queryFn: fetchNotes,
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: docsQueryKeys.notes });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async (payload: {
      noteId: string;
      title: string;
      bodyMarkdown: string;
      tags: string[];
    }) =>
      updateNote(payload.noteId, {
        title: payload.title,
        bodyMarkdown: payload.bodyMarkdown,
        tags: payload.tags,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: docsQueryKeys.notes });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: deleteNoteFromApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: docsQueryKeys.notes });
    },
  });

  useEffect(() => {
    if (notesQuery.error) {
      onBanner(
        notesQuery.error instanceof Error ? notesQuery.error.message : DocsPageCopy.loadError,
      );
      return;
    }
    if (notesQuery.isSuccess) {
      onBanner(null);
    }
  }, [notesQuery.error, notesQuery.isSuccess, onBanner]);

  const clearForm = () => {
    setEditingNoteId(null);
    reset(docsNoteFormDefaults);
  };

  const startEdit = async (id: string) => {
    onBanner(null);
    try {
      const data = await fetchNoteDetail(id);
      setEditingNoteId(id);
      reset({
        title: data.title,
        bodyMarkdown: data.bodyMarkdown,
        tagsComma: data.tags.join(', '),
      });
    } catch (e) {
      onBanner(e instanceof Error ? e.message : DocsPageCopy.loadError);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const tags = splitCommaList(data.tagsComma);
    onBanner(null);

    if (editingNoteId !== null) {
      const parsed = updateReferenceNoteBodySchema.safeParse({
        title: data.title,
        bodyMarkdown: data.bodyMarkdown,
        tags,
      });
      if (!parsed.success) {
        onBanner(parsed.error.issues[0]?.message ?? 'Invalid');
        return;
      }
      try {
        await updateNoteMutation.mutateAsync({
          noteId: editingNoteId,
          title: data.title,
          bodyMarkdown: data.bodyMarkdown,
          tags,
        });
        clearForm();
      } catch (err) {
        onBanner(err instanceof Error ? err.message : DocsPageCopy.loadError);
      }
      return;
    }

    const parsed = createReferenceNoteBodySchema.safeParse({
      title: data.title,
      bodyMarkdown: data.bodyMarkdown,
      tags,
    });
    if (!parsed.success) {
      onBanner(parsed.error.issues[0]?.message ?? 'Invalid');
      return;
    }
    try {
      await createNoteMutation.mutateAsync({
        title: parsed.data.title,
        bodyMarkdown: parsed.data.bodyMarkdown,
        tags: parsed.data.tags,
      });
      clearForm();
    } catch (err) {
      onBanner(err instanceof Error ? err.message : DocsPageCopy.loadError);
    }
  });

  const deleteNote = async (id: string) => {
    onBanner(null);
    setDeletingNoteId(id);
    try {
      await deleteNoteMutation.mutateAsync(id);
      if (editingNoteId === id) {
        clearForm();
      }
    } catch (err) {
      onBanner(err instanceof Error ? err.message : DocsPageCopy.loadError);
    } finally {
      setDeletingNoteId(null);
    }
  };

  return (
    <Stack gap={3}>
      <DashboardWidget title={DocsPageCopy.tabNotes} flexShrink={0}>
        <form onSubmit={onSubmit}>
          <Stack gap={2}>
            <Field.Root invalid={!!errors.title}>
              <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.noteTitleLabel}</Field.Label>
              <Input size="sm" {...docsInputStyles} h="32px" {...register('title')} />
              {errors.title?.message ? (
                <Text fontSize="8px" color="red.600" mt={0.5}>
                  {errors.title.message}
                </Text>
              ) : null}
            </Field.Root>
            <Field.Root invalid={!!errors.bodyMarkdown}>
              <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.noteBodyLabel}</Field.Label>
              <Textarea
                {...docsInputStyles}
                minH="100px"
                fontSize="sm"
                {...register('bodyMarkdown')}
              />
              {errors.bodyMarkdown?.message ? (
                <Text fontSize="8px" color="red.600" mt={0.5}>
                  {errors.bodyMarkdown.message}
                </Text>
              ) : null}
            </Field.Root>
            <Field.Root>
              <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.noteTagsLabel}</Field.Label>
              <Input size="sm" {...docsInputStyles} h="32px" {...register('tagsComma')} />
            </Field.Root>
            <Flex gap={2}>
              <Button
                type="submit"
                size="xs"
                fontSize="9px"
                bg={dashboardTheme.title}
                color="white"
                loading={
                  isSubmitting || createNoteMutation.isPending || updateNoteMutation.isPending
                }
              >
                {editingNoteId !== null ? DocsPageCopy.noteSave : DocsPageCopy.noteAdd}
              </Button>
              {editingNoteId !== null ? (
                <Button
                  type="button"
                  size="xs"
                  fontSize="9px"
                  variant="outline"
                  borderColor={dashboardTheme.cardBorder}
                  onClick={() => clearForm()}
                >
                  {DocsPageCopy.noteCancelEdit}
                </Button>
              ) : null}
            </Flex>
          </Stack>
        </form>
        {notesQuery.isLoading ? (
          <Text fontSize="9px" color={dashboardTheme.meta} mt={3}>
            {DocsPageCopy.loading}
          </Text>
        ) : (notesQuery.data ?? []).length === 0 ? (
          <Text fontSize="9px" color={dashboardTheme.meta} mt={3}>
            {DocsPageCopy.notesEmpty}
          </Text>
        ) : (
          <Stack gap={1} mt={3}>
            {(notesQuery.data ?? []).map((note) => (
              <DashboardListRow
                key={note.id}
                leading={<Text fontSize="10px">◇</Text>}
                title={note.title}
                meta={formatNoteMeta(note)}
                trailing={
                  <Flex gap={1}>
                    <Button
                      type="button"
                      size="xs"
                      fontSize="8px"
                      h="20px"
                      variant="outline"
                      borderColor={dashboardTheme.cardBorder}
                      onClick={() => void startEdit(note.id)}
                    >
                      {DocsPageCopy.noteEdit}
                    </Button>
                    <Button
                      type="button"
                      size="xs"
                      fontSize="8px"
                      h="20px"
                      variant="outline"
                      borderColor={dashboardTheme.cardBorder}
                      loading={deletingNoteId === note.id}
                      disabled={deleteNoteMutation.isPending && deletingNoteId !== note.id}
                      onClick={() => void deleteNote(note.id)}
                    >
                      {DocsPageCopy.noteDelete}
                    </Button>
                  </Flex>
                }
              />
            ))}
          </Stack>
        )}
      </DashboardWidget>
    </Stack>
  );
}
