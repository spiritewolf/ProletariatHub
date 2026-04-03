import { z } from 'zod';

/** Dashboard strip: counts + recent note titles (no secrets). */
export const dashboardDocsPreviewSchema = z.object({
  referenceNoteCount: z.number().int().nonnegative(),
  credentialCount: z.number().int().nonnegative(),
  contactCount: z.number().int().nonnegative(),
  recentNotes: z.array(
    z.object({
      id: z.uuid(),
      title: z.string(),
    }),
  ),
});

export const referenceNoteListItemSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  updatedAt: z.number().int(),
  tags: z.array(z.string()),
});

export const referenceNoteDetailSchema = referenceNoteListItemSchema.extend({
  bodyMarkdown: z.string(),
});

export const referenceNotesListResponseSchema = z.object({
  notes: z.array(referenceNoteListItemSchema),
});

export const referenceNoteDetailResponseSchema = z.object({
  note: referenceNoteDetailSchema,
});

export const createReferenceNoteBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  bodyMarkdown: z.string().max(100_000),
  tags: z.array(z.string().trim().min(1).max(64)).max(32).optional().default([]),
});

export const createReferenceNoteResponseSchema = z.object({
  note: referenceNoteDetailSchema,
});

export const updateReferenceNoteBodySchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  bodyMarkdown: z.string().max(100_000).optional(),
  tags: z.array(z.string().trim().min(1).max(64)).max(32).optional(),
});

export const updateReferenceNoteResponseSchema = z.object({
  note: referenceNoteDetailSchema,
});

export const credentialListItemSchema = z.object({
  id: z.uuid(),
  label: z.string(),
  username: z.string().nullable(),
  urlOrApp: z.string().nullable(),
  notesPlain: z.string().nullable(),
  updatedAt: z.number().int(),
});

export const credentialsListResponseSchema = z.object({
  credentials: z.array(credentialListItemSchema),
});

export const createCredentialBodySchema = z.object({
  label: z.string().trim().min(1).max(200),
  username: z.string().trim().max(500).optional(),
  secretPlain: z.string().min(1).max(10_000),
  urlOrApp: z.string().trim().max(2000).optional(),
  notesPlain: z.string().trim().max(5000).optional(),
});

export const createCredentialResponseSchema = z.object({
  credential: credentialListItemSchema,
});

export const updateCredentialBodySchema = z.object({
  label: z.string().trim().min(1).max(200).optional(),
  username: z.union([z.string().trim().max(500), z.null()]).optional(),
  secretPlain: z.string().min(1).max(10_000).optional(),
  urlOrApp: z.union([z.string().trim().max(2000), z.null()]).optional(),
  notesPlain: z.union([z.string().trim().max(5000), z.null()]).optional(),
});

export const updateCredentialResponseSchema = z.object({
  credential: credentialListItemSchema,
});

export const revealCredentialResponseSchema = z.object({
  secretPlain: z.string(),
});

export const contactListItemSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  category: z.string().nullable(),
  phones: z.array(z.string()),
  emails: z.array(z.string()),
  address: z.string().nullable(),
  notes: z.string().nullable(),
  updatedAt: z.number().int(),
});

export const contactsListResponseSchema = z.object({
  contacts: z.array(contactListItemSchema),
});

export const createContactBodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  category: z.string().trim().max(100).optional(),
  phones: z.array(z.string().trim().min(1).max(64)).max(20).optional().default([]),
  emails: z.array(z.string().trim().min(1).max(200)).max(20).optional().default([]),
  address: z.string().trim().max(2000).optional(),
  notes: z.string().trim().max(5000).optional(),
});

export const createContactResponseSchema = z.object({
  contact: contactListItemSchema,
});

export const updateContactBodySchema = z.object({
  name: z.string().trim().min(1).max(200).optional(),
  category: z.union([z.string().trim().max(100), z.null()]).optional(),
  phones: z.array(z.string().trim().min(1).max(64)).max(20).optional(),
  emails: z.array(z.string().trim().min(1).max(200)).max(20).optional(),
  address: z.union([z.string().trim().max(2000), z.null()]).optional(),
  notes: z.union([z.string().trim().max(5000), z.null()]).optional(),
});

export const updateContactResponseSchema = z.object({
  contact: contactListItemSchema,
});

export type DashboardDocsPreview = z.infer<typeof dashboardDocsPreviewSchema>;
export type ReferenceNoteListItem = z.infer<typeof referenceNoteListItemSchema>;
export type ReferenceNoteDetail = z.infer<typeof referenceNoteDetailSchema>;
export type CredentialListItem = z.infer<typeof credentialListItemSchema>;
export type ContactListItem = z.infer<typeof contactListItemSchema>;
