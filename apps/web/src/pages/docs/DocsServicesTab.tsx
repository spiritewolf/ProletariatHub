import { Button, Field, Flex, Input, NativeSelect, Stack, Text } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createServiceTileBodySchema,
  createServiceTileResponseSchema,
  type ServiceTile,
  serviceTilesListResponseSchema,
  updateServiceTileBodySchema,
  updateServiceTileResponseSchema,
} from '@proletariat-hub/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { apiJsonValidated, apiNoContent } from '../../api';
import { DashboardListRow } from '../../dashboard/components/DashboardListRow';
import { DashboardWidget } from '../../dashboard/components/DashboardWidget';
import { dashboardTheme } from '../../dashboard/dashboardTheme';
import { DocsApiPaths } from './docsApiPaths';
import { DocsPageCopy } from './docsCopy';
import { docsFieldLabelProps, docsInputStyles } from './docsFormStyles';
import { docsQueryKeys } from './docsQueryKeys';

const serviceTileFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  url: z.string().url('Use a full URL, e.g. http://localhost:8096'),
  category: z.enum(['media', 'tools', 'other']),
  description: z.string(),
});

type ServiceTileFormValues = z.infer<typeof serviceTileFormSchema>;

const serviceTileDefaults: ServiceTileFormValues = {
  name: '',
  url: '',
  category: 'media',
  description: '',
};

type DocsServicesTabProps = {
  onBanner: (message: string | null) => void;
};

export function DocsServicesTab({ onBanner }: DocsServicesTabProps) {
  const queryClient = useQueryClient();
  const [editingTileId, setEditingTileId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceTileFormValues>({
    resolver: zodResolver(serviceTileFormSchema),
    defaultValues: serviceTileDefaults,
  });

  const tilesQuery = useQuery({
    queryKey: docsQueryKeys.serviceTiles,
    queryFn: async () => {
      const data = await apiJsonValidated(
        DocsApiPaths.serviceTiles,
        serviceTilesListResponseSchema,
      );
      return data.serviceTiles;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      url: string;
      category: 'media' | 'tools' | 'other';
      description?: string;
    }) =>
      apiJsonValidated(DocsApiPaths.serviceTiles, createServiceTileResponseSchema, {
        method: 'POST',
        json: payload,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: docsQueryKeys.serviceTiles });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      name: string;
      url: string;
      category: 'media' | 'tools' | 'other';
      description: string | null;
    }) =>
      apiJsonValidated(DocsApiPaths.serviceTile(payload.id), updateServiceTileResponseSchema, {
        method: 'PATCH',
        json: {
          name: payload.name,
          url: payload.url,
          category: payload.category,
          description: payload.description,
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: docsQueryKeys.serviceTiles });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiNoContent(DocsApiPaths.serviceTile(id), { method: 'DELETE' });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: docsQueryKeys.serviceTiles });
    },
  });

  const clearForm = () => {
    setEditingTileId(null);
    reset(serviceTileDefaults);
  };

  const startEdit = (tile: ServiceTile) => {
    setEditingTileId(tile.id);
    reset({
      name: tile.name,
      url: tile.url,
      category: tile.category,
      description: tile.description ?? '',
    });
  };

  const onSubmit = handleSubmit(async (values) => {
    onBanner(null);
    if (editingTileId !== null) {
      const parsed = updateServiceTileBodySchema.safeParse({
        name: values.name,
        url: values.url,
        category: values.category,
        description: values.description.trim().length > 0 ? values.description.trim() : null,
      });
      if (!parsed.success) {
        onBanner(parsed.error.issues[0]?.message ?? 'Invalid');
        return;
      }
      try {
        await updateMutation.mutateAsync({
          id: editingTileId,
          name: parsed.data.name ?? values.name,
          url: parsed.data.url ?? values.url,
          category: parsed.data.category ?? values.category,
          description: parsed.data.description ?? null,
        });
        clearForm();
      } catch (err) {
        onBanner(err instanceof Error ? err.message : DocsPageCopy.loadError);
      }
      return;
    }

    const parsed = createServiceTileBodySchema.safeParse({
      name: values.name,
      url: values.url,
      category: values.category,
      description: values.description.trim().length > 0 ? values.description.trim() : undefined,
    });
    if (!parsed.success) {
      onBanner(parsed.error.issues[0]?.message ?? 'Invalid');
      return;
    }
    try {
      await createMutation.mutateAsync({
        name: parsed.data.name,
        url: parsed.data.url,
        category: parsed.data.category,
        description: parsed.data.description,
      });
      clearForm();
    } catch (err) {
      onBanner(err instanceof Error ? err.message : DocsPageCopy.loadError);
    }
  });

  const onDelete = async (tileId: string) => {
    setDeletingId(tileId);
    onBanner(null);
    try {
      await deleteMutation.mutateAsync(tileId);
      if (editingTileId === tileId) {
        clearForm();
      }
    } catch (err) {
      onBanner(err instanceof Error ? err.message : DocsPageCopy.loadError);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardWidget title={DocsPageCopy.tabServices} flexShrink={0}>
      <form onSubmit={onSubmit}>
        <Stack gap={2}>
          <Field.Root invalid={!!errors.name}>
            <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.serviceNameLabel}</Field.Label>
            <Input size="sm" {...docsInputStyles} h="32px" {...register('name')} />
            {errors.name?.message ? (
              <Text fontSize="8px" color="red.600" mt={0.5}>
                {errors.name.message}
              </Text>
            ) : null}
          </Field.Root>
          <Field.Root invalid={!!errors.url}>
            <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.serviceUrlLabel}</Field.Label>
            <Input size="sm" {...docsInputStyles} h="32px" {...register('url')} />
            {errors.url?.message ? (
              <Text fontSize="8px" color="red.600" mt={0.5}>
                {errors.url.message}
              </Text>
            ) : null}
          </Field.Root>
          <Field.Root>
            <Field.Label {...docsFieldLabelProps}>{DocsPageCopy.serviceCategoryLabel}</Field.Label>
            <NativeSelect.Root size="sm">
              <NativeSelect.Field {...docsInputStyles} h="32px" {...register('category')}>
                <option value="media">media</option>
                <option value="tools">tools</option>
                <option value="other">other</option>
              </NativeSelect.Field>
            </NativeSelect.Root>
          </Field.Root>
          <Field.Root>
            <Field.Label {...docsFieldLabelProps}>
              {DocsPageCopy.serviceDescriptionLabel}
            </Field.Label>
            <Input size="sm" {...docsInputStyles} h="32px" {...register('description')} />
          </Field.Root>
          <Flex gap={2}>
            <Button
              type="submit"
              size="xs"
              fontSize="9px"
              bg={dashboardTheme.title}
              color="white"
              loading={isSubmitting || createMutation.isPending || updateMutation.isPending}
            >
              {editingTileId ? DocsPageCopy.serviceSave : DocsPageCopy.serviceAdd}
            </Button>
            {editingTileId ? (
              <Button
                type="button"
                size="xs"
                fontSize="9px"
                variant="outline"
                borderColor={dashboardTheme.cardBorder}
                onClick={() => clearForm()}
              >
                {DocsPageCopy.serviceCancelEdit}
              </Button>
            ) : null}
          </Flex>
        </Stack>
      </form>

      {tilesQuery.isLoading ? (
        <Text fontSize="9px" color={dashboardTheme.meta} mt={3}>
          {DocsPageCopy.loading}
        </Text>
      ) : (tilesQuery.data ?? []).length === 0 ? (
        <Text fontSize="9px" color={dashboardTheme.meta} mt={3}>
          {DocsPageCopy.servicesEmpty}
        </Text>
      ) : (
        <Stack gap={1} mt={3}>
          {(tilesQuery.data ?? []).map((tile) => (
            <DashboardListRow
              key={tile.id}
              leading={<Text fontSize="10px">◆</Text>}
              title={tile.name}
              meta={tile.url}
              trailing={
                <Flex gap={1}>
                  <Button
                    type="button"
                    size="xs"
                    fontSize="8px"
                    h="20px"
                    variant="outline"
                    borderColor={dashboardTheme.cardBorder}
                    onClick={() => startEdit(tile)}
                  >
                    {DocsPageCopy.serviceEdit}
                  </Button>
                  <Button
                    type="button"
                    size="xs"
                    fontSize="8px"
                    h="20px"
                    variant="outline"
                    borderColor={dashboardTheme.cardBorder}
                    loading={deletingId === tile.id}
                    disabled={deleteMutation.isPending && deletingId !== tile.id}
                    onClick={() => void onDelete(tile.id)}
                  >
                    {DocsPageCopy.serviceDelete}
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
