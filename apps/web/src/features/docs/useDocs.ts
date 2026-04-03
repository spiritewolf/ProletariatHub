import {
  contactsListResponseSchema,
  createContactBodySchema,
  createContactResponseSchema,
  createCredentialBodySchema,
  createCredentialResponseSchema,
  createReferenceNoteBodySchema,
  createReferenceNoteResponseSchema,
  createServiceTileBodySchema,
  createServiceTileResponseSchema,
  credentialsListResponseSchema,
  referenceNoteDetailResponseSchema,
  referenceNotesListResponseSchema,
  revealCredentialResponseSchema,
  serviceTilesListResponseSchema,
  updateReferenceNoteBodySchema,
  updateReferenceNoteResponseSchema,
  updateServiceTileBodySchema,
  updateServiceTileResponseSchema,
} from '@proletariat-hub/contracts';
import { useCallback } from 'react';
import { z } from 'zod';

import { apiJsonValidated, apiNoContent } from '@/lib/api';

import { DocsApiPaths } from './docsApiPaths';

export function useDocs() {
  const fetchNotes = useCallback(async () => {
    const data = await apiJsonValidated(DocsApiPaths.notes, referenceNotesListResponseSchema);
    return data.notes;
  }, []);

  const fetchNoteDetail = useCallback(async (id: string) => {
    const data = await apiJsonValidated(DocsApiPaths.note(id), referenceNoteDetailResponseSchema);
    return data.note;
  }, []);

  const createNote = useCallback(async (payload: z.infer<typeof createReferenceNoteBodySchema>) => {
    await apiJsonValidated(DocsApiPaths.notes, createReferenceNoteResponseSchema, {
      method: 'POST',
      json: payload,
    });
  }, []);

  const updateNote = useCallback(
    async (noteId: string, payload: z.infer<typeof updateReferenceNoteBodySchema>) => {
      await apiJsonValidated(DocsApiPaths.note(noteId), updateReferenceNoteResponseSchema, {
        method: 'PATCH',
        json: payload,
      });
    },
    [],
  );

  const deleteNote = useCallback(async (noteId: string) => {
    await apiNoContent(DocsApiPaths.note(noteId), { method: 'DELETE' });
  }, []);

  const fetchCredentials = useCallback(async () => {
    const data = await apiJsonValidated(DocsApiPaths.credentials, credentialsListResponseSchema);
    return data.credentials;
  }, []);

  const createCredential = useCallback(
    async (payload: z.infer<typeof createCredentialBodySchema>) => {
      await apiJsonValidated(DocsApiPaths.credentials, createCredentialResponseSchema, {
        method: 'POST',
        json: payload,
      });
    },
    [],
  );

  const revealCredential = useCallback(async (id: string) => {
    const data = await apiJsonValidated(
      DocsApiPaths.credentialReveal(id),
      revealCredentialResponseSchema,
      {
        method: 'POST',
        json: {},
      },
    );
    return data.secretPlain;
  }, []);

  const deleteCredential = useCallback(async (id: string) => {
    await apiNoContent(DocsApiPaths.credential(id), { method: 'DELETE' });
  }, []);

  const fetchContacts = useCallback(async () => {
    const data = await apiJsonValidated(DocsApiPaths.contacts, contactsListResponseSchema);
    return data.contacts;
  }, []);

  const createContact = useCallback(async (payload: z.infer<typeof createContactBodySchema>) => {
    await apiJsonValidated(DocsApiPaths.contacts, createContactResponseSchema, {
      method: 'POST',
      json: payload,
    });
  }, []);

  const deleteContact = useCallback(async (id: string) => {
    await apiNoContent(DocsApiPaths.contact(id), { method: 'DELETE' });
  }, []);

  const fetchServiceTiles = useCallback(async () => {
    const data = await apiJsonValidated(DocsApiPaths.serviceTiles, serviceTilesListResponseSchema);
    return data.serviceTiles;
  }, []);

  const createServiceTile = useCallback(
    async (payload: z.infer<typeof createServiceTileBodySchema>) => {
      await apiJsonValidated(DocsApiPaths.serviceTiles, createServiceTileResponseSchema, {
        method: 'POST',
        json: payload,
      });
    },
    [],
  );

  const updateServiceTile = useCallback(
    async (id: string, payload: z.infer<typeof updateServiceTileBodySchema>) => {
      await apiJsonValidated(DocsApiPaths.serviceTile(id), updateServiceTileResponseSchema, {
        method: 'PATCH',
        json: payload,
      });
    },
    [],
  );

  const deleteServiceTile = useCallback(async (id: string) => {
    await apiNoContent(DocsApiPaths.serviceTile(id), { method: 'DELETE' });
  }, []);

  return {
    fetchNotes,
    fetchNoteDetail,
    createNote,
    updateNote,
    deleteNote,
    fetchCredentials,
    createCredential,
    revealCredential,
    deleteCredential,
    fetchContacts,
    createContact,
    deleteContact,
    fetchServiceTiles,
    createServiceTile,
    updateServiceTile,
    deleteServiceTile,
  };
}
