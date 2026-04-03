import { randomUUID } from 'node:crypto';

import {
  contactListItemSchema,
  contactsListResponseSchema,
  createContactBodySchema,
  createContactResponseSchema,
  createCredentialBodySchema,
  createCredentialResponseSchema,
  createReferenceNoteBodySchema,
  createReferenceNoteResponseSchema,
  credentialListItemSchema,
  credentialsListResponseSchema,
  referenceNoteDetailResponseSchema,
  referenceNoteDetailSchema,
  referenceNoteListItemSchema,
  referenceNotesListResponseSchema,
  revealCredentialResponseSchema,
  updateContactBodySchema,
  updateContactResponseSchema,
  updateCredentialBodySchema,
  updateCredentialResponseSchema,
  updateReferenceNoteBodySchema,
  updateReferenceNoteResponseSchema,
} from '@proletariat-hub/contracts';
import type { InferSelectModel } from 'drizzle-orm';
import { and, desc, eq } from 'drizzle-orm';
import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

import { attachSession, requirePasswordGateCleared, requireSetupComplete } from '../auth/hooks.js';
import { db } from '../db/index.js';
import { contacts, credentialEntries, referenceNotes } from '../db/schema.js';
import { decryptCredentialSecret, encryptCredentialSecret } from '../lib/credentialCrypto.js';
import { parseJsonBody } from '../lib/parseJsonBody.js';

type ReferenceNoteRow = InferSelectModel<typeof referenceNotes>;
type CredentialRow = InferSelectModel<typeof credentialEntries>;
type ContactRow = InferSelectModel<typeof contacts>;

const noteIdParamSchema = z.object({ noteId: z.uuid() });
const credentialIdParamSchema = z.object({ credentialId: z.uuid() });
const contactIdParamSchema = z.object({ contactId: z.uuid() });

function parseStringArrayJson(raw: string | null): string[] {
  if (raw === null || raw.length === 0) {
    return [];
  }
  try {
    const v: unknown = JSON.parse(raw);
    if (!Array.isArray(v)) {
      return [];
    }
    return v.filter((x): x is string => typeof x === 'string');
  } catch {
    return [];
  }
}

function serializeTagsJson(tags: string[]): string | null {
  if (tags.length === 0) {
    return null;
  }
  return JSON.stringify(tags);
}

function serializeNoteListItem(row: ReferenceNoteRow) {
  return referenceNoteListItemSchema.parse({
    id: row.id,
    title: row.title,
    updatedAt: row.updatedAt,
    tags: parseStringArrayJson(row.tagsJson),
  });
}

function serializeNoteDetail(row: ReferenceNoteRow) {
  return referenceNoteDetailSchema.parse({
    ...serializeNoteListItem(row),
    bodyMarkdown: row.bodyMarkdown,
  });
}

function serializeCredentialListItem(row: CredentialRow) {
  return credentialListItemSchema.parse({
    id: row.id,
    label: row.label,
    username: row.username ?? null,
    urlOrApp: row.urlOrApp ?? null,
    notesPlain: row.notesPlain ?? null,
    updatedAt: row.updatedAt,
  });
}

function serializeContactListItem(row: ContactRow) {
  return contactListItemSchema.parse({
    id: row.id,
    name: row.name,
    category: row.category ?? null,
    phones: parseStringArrayJson(row.phonesJson),
    emails: parseStringArrayJson(row.emailsJson),
    address: row.address ?? null,
    notes: row.notes ?? null,
    updatedAt: row.updatedAt,
  });
}

export const docsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', attachSession);
  fastify.addHook('preHandler', requirePasswordGateCleared);
  fastify.addHook('preHandler', requireSetupComplete);

  fastify.get('/notes', async (req) => {
    const hubId = req.comrade!.hubId;
    const rows = db
      .select()
      .from(referenceNotes)
      .where(eq(referenceNotes.hubId, hubId))
      .orderBy(desc(referenceNotes.updatedAt))
      .all();
    const notes = rows.map((r) => serializeNoteListItem(r));
    return referenceNotesListResponseSchema.parse({ notes });
  });

  fastify.get<{ Params: { noteId: string } }>('/notes/:noteId', async (req, reply) => {
    const parsed = noteIdParamSchema.safeParse(req.params);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid note id' });
    }
    const hubId = req.comrade!.hubId;
    const row = db
      .select()
      .from(referenceNotes)
      .where(and(eq(referenceNotes.id, parsed.data.noteId), eq(referenceNotes.hubId, hubId)))
      .get();
    if (row === undefined) {
      return reply.status(404).send({ error: 'Note not found' });
    }
    return referenceNoteDetailResponseSchema.parse({ note: serializeNoteDetail(row) });
  });

  fastify.post('/notes', async (req, reply) => {
    const hubId = req.comrade!.hubId;
    const body = parseJsonBody(createReferenceNoteBodySchema, req.body, reply);
    if (body === null) {
      return;
    }
    const id = randomUUID();
    const now = Date.now();
    db.insert(referenceNotes)
      .values({
        id,
        hubId,
        title: body.title,
        bodyMarkdown: body.bodyMarkdown,
        tagsJson: serializeTagsJson(body.tags),
        createdAt: now,
        updatedAt: now,
      })
      .run();
    const row = db.select().from(referenceNotes).where(eq(referenceNotes.id, id)).get()!;
    return createReferenceNoteResponseSchema.parse({ note: serializeNoteDetail(row) });
  });

  fastify.patch<{ Params: { noteId: string } }>('/notes/:noteId', async (req, reply) => {
    const parsed = noteIdParamSchema.safeParse(req.params);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid note id' });
    }
    const body = parseJsonBody(updateReferenceNoteBodySchema, req.body, reply);
    if (body === null) {
      return;
    }
    if (body.title === undefined && body.bodyMarkdown === undefined && body.tags === undefined) {
      return reply.status(400).send({ error: 'No fields to update' });
    }
    const hubId = req.comrade!.hubId;
    const existing = db
      .select()
      .from(referenceNotes)
      .where(and(eq(referenceNotes.id, parsed.data.noteId), eq(referenceNotes.hubId, hubId)))
      .get();
    if (existing === undefined) {
      return reply.status(404).send({ error: 'Note not found' });
    }
    const now = Date.now();
    db.update(referenceNotes)
      .set({
        title: body.title ?? existing.title,
        bodyMarkdown: body.bodyMarkdown ?? existing.bodyMarkdown,
        tagsJson: body.tags !== undefined ? serializeTagsJson(body.tags) : existing.tagsJson,
        updatedAt: now,
      })
      .where(eq(referenceNotes.id, parsed.data.noteId))
      .run();
    const row = db
      .select()
      .from(referenceNotes)
      .where(eq(referenceNotes.id, parsed.data.noteId))
      .get()!;
    return updateReferenceNoteResponseSchema.parse({ note: serializeNoteDetail(row) });
  });

  fastify.delete<{ Params: { noteId: string } }>('/notes/:noteId', async (req, reply) => {
    const parsed = noteIdParamSchema.safeParse(req.params);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid note id' });
    }
    const hubId = req.comrade!.hubId;
    const result = db
      .delete(referenceNotes)
      .where(and(eq(referenceNotes.id, parsed.data.noteId), eq(referenceNotes.hubId, hubId)))
      .run();
    if (result.changes === 0) {
      return reply.status(404).send({ error: 'Note not found' });
    }
    return reply.status(204).send();
  });

  fastify.get('/credentials', async (req) => {
    const hubId = req.comrade!.hubId;
    const rows = db
      .select()
      .from(credentialEntries)
      .where(eq(credentialEntries.hubId, hubId))
      .orderBy(desc(credentialEntries.updatedAt))
      .all();
    const credentials = rows.map((r) => serializeCredentialListItem(r));
    return credentialsListResponseSchema.parse({ credentials });
  });

  fastify.post('/credentials', async (req, reply) => {
    const hubId = req.comrade!.hubId;
    const body = parseJsonBody(createCredentialBodySchema, req.body, reply);
    if (body === null) {
      return;
    }
    const id = randomUUID();
    const now = Date.now();
    let ciphertext: Buffer;
    try {
      ciphertext = encryptCredentialSecret(body.secretPlain);
    } catch {
      return reply.status(500).send({ error: 'Could not encrypt secret' });
    }
    db.insert(credentialEntries)
      .values({
        id,
        hubId,
        label: body.label,
        username: body.username ?? null,
        secretCiphertext: ciphertext,
        urlOrApp: body.urlOrApp ?? null,
        notesPlain: body.notesPlain ?? null,
        keyVersion: 1,
        createdAt: now,
        updatedAt: now,
      })
      .run();
    const row = db.select().from(credentialEntries).where(eq(credentialEntries.id, id)).get()!;
    return createCredentialResponseSchema.parse({ credential: serializeCredentialListItem(row) });
  });

  fastify.patch<{ Params: { credentialId: string } }>(
    '/credentials/:credentialId',
    async (req, reply) => {
      const parsed = credentialIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Invalid credential id' });
      }
      const body = parseJsonBody(updateCredentialBodySchema, req.body, reply);
      if (body === null) {
        return;
      }
      if (
        body.label === undefined &&
        body.username === undefined &&
        body.secretPlain === undefined &&
        body.urlOrApp === undefined &&
        body.notesPlain === undefined
      ) {
        return reply.status(400).send({ error: 'No fields to update' });
      }
      const hubId = req.comrade!.hubId;
      const existing = db
        .select()
        .from(credentialEntries)
        .where(
          and(
            eq(credentialEntries.id, parsed.data.credentialId),
            eq(credentialEntries.hubId, hubId),
          ),
        )
        .get();
      if (existing === undefined) {
        return reply.status(404).send({ error: 'Credential not found' });
      }
      const now = Date.now();
      let secretCiphertext = existing.secretCiphertext;
      if (body.secretPlain !== undefined) {
        try {
          secretCiphertext = encryptCredentialSecret(body.secretPlain);
        } catch {
          return reply.status(500).send({ error: 'Could not encrypt secret' });
        }
      }
      db.update(credentialEntries)
        .set({
          label: body.label ?? existing.label,
          username: body.username !== undefined ? body.username : existing.username,
          urlOrApp: body.urlOrApp !== undefined ? body.urlOrApp : existing.urlOrApp,
          notesPlain: body.notesPlain !== undefined ? body.notesPlain : existing.notesPlain,
          secretCiphertext,
          keyVersion: 1,
          updatedAt: now,
        })
        .where(eq(credentialEntries.id, parsed.data.credentialId))
        .run();
      const row = db
        .select()
        .from(credentialEntries)
        .where(eq(credentialEntries.id, parsed.data.credentialId))
        .get()!;
      return updateCredentialResponseSchema.parse({ credential: serializeCredentialListItem(row) });
    },
  );

  fastify.post<{ Params: { credentialId: string } }>(
    '/credentials/:credentialId/reveal',
    async (req, reply) => {
      const parsed = credentialIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Invalid credential id' });
      }
      const hubId = req.comrade!.hubId;
      const row = db
        .select()
        .from(credentialEntries)
        .where(
          and(
            eq(credentialEntries.id, parsed.data.credentialId),
            eq(credentialEntries.hubId, hubId),
          ),
        )
        .get();
      if (row === undefined) {
        return reply.status(404).send({ error: 'Credential not found' });
      }
      let secretPlain: string;
      try {
        secretPlain = decryptCredentialSecret(row.secretCiphertext);
      } catch {
        return reply.status(500).send({ error: 'Could not decrypt secret' });
      }
      return revealCredentialResponseSchema.parse({ secretPlain });
    },
  );

  fastify.delete<{ Params: { credentialId: string } }>(
    '/credentials/:credentialId',
    async (req, reply) => {
      const parsed = credentialIdParamSchema.safeParse(req.params);
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Invalid credential id' });
      }
      const hubId = req.comrade!.hubId;
      const result = db
        .delete(credentialEntries)
        .where(
          and(
            eq(credentialEntries.id, parsed.data.credentialId),
            eq(credentialEntries.hubId, hubId),
          ),
        )
        .run();
      if (result.changes === 0) {
        return reply.status(404).send({ error: 'Credential not found' });
      }
      return reply.status(204).send();
    },
  );

  fastify.get('/contacts', async (req) => {
    const hubId = req.comrade!.hubId;
    const rows = db
      .select()
      .from(contacts)
      .where(eq(contacts.hubId, hubId))
      .orderBy(desc(contacts.updatedAt))
      .all();
    const list = rows.map((r) => serializeContactListItem(r));
    return contactsListResponseSchema.parse({ contacts: list });
  });

  fastify.post('/contacts', async (req, reply) => {
    const hubId = req.comrade!.hubId;
    const body = parseJsonBody(createContactBodySchema, req.body, reply);
    if (body === null) {
      return;
    }
    const id = randomUUID();
    const now = Date.now();
    db.insert(contacts)
      .values({
        id,
        hubId,
        name: body.name,
        category: body.category ?? null,
        phonesJson: body.phones.length > 0 ? JSON.stringify(body.phones) : null,
        emailsJson: body.emails.length > 0 ? JSON.stringify(body.emails) : null,
        address: body.address ?? null,
        notes: body.notes ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .run();
    const row = db.select().from(contacts).where(eq(contacts.id, id)).get()!;
    return createContactResponseSchema.parse({ contact: serializeContactListItem(row) });
  });

  fastify.patch<{ Params: { contactId: string } }>('/contacts/:contactId', async (req, reply) => {
    const parsed = contactIdParamSchema.safeParse(req.params);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid contact id' });
    }
    const body = parseJsonBody(updateContactBodySchema, req.body, reply);
    if (body === null) {
      return;
    }
    if (
      body.name === undefined &&
      body.category === undefined &&
      body.phones === undefined &&
      body.emails === undefined &&
      body.address === undefined &&
      body.notes === undefined
    ) {
      return reply.status(400).send({ error: 'No fields to update' });
    }
    const hubId = req.comrade!.hubId;
    const existing = db
      .select()
      .from(contacts)
      .where(and(eq(contacts.id, parsed.data.contactId), eq(contacts.hubId, hubId)))
      .get();
    if (existing === undefined) {
      return reply.status(404).send({ error: 'Contact not found' });
    }
    const phones =
      body.phones !== undefined
        ? body.phones.length > 0
          ? JSON.stringify(body.phones)
          : null
        : existing.phonesJson;
    const emails =
      body.emails !== undefined
        ? body.emails.length > 0
          ? JSON.stringify(body.emails)
          : null
        : existing.emailsJson;
    const now = Date.now();
    db.update(contacts)
      .set({
        name: body.name ?? existing.name,
        category: body.category !== undefined ? body.category : existing.category,
        phonesJson: phones,
        emailsJson: emails,
        address: body.address !== undefined ? body.address : existing.address,
        notes: body.notes !== undefined ? body.notes : existing.notes,
        updatedAt: now,
      })
      .where(eq(contacts.id, parsed.data.contactId))
      .run();
    const row = db.select().from(contacts).where(eq(contacts.id, parsed.data.contactId)).get()!;
    return updateContactResponseSchema.parse({ contact: serializeContactListItem(row) });
  });

  fastify.delete<{ Params: { contactId: string } }>('/contacts/:contactId', async (req, reply) => {
    const parsed = contactIdParamSchema.safeParse(req.params);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid contact id' });
    }
    const hubId = req.comrade!.hubId;
    const result = db
      .delete(contacts)
      .where(and(eq(contacts.id, parsed.data.contactId), eq(contacts.hubId, hubId)))
      .run();
    if (result.changes === 0) {
      return reply.status(404).send({ error: 'Contact not found' });
    }
    return reply.status(204).send();
  });
};
