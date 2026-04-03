import { z } from 'zod';

/** UI shape for the reference note form (`tagsComma` → API `tags` on submit). */
export const docsNoteFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200),
  bodyMarkdown: z.string().max(100_000),
  tagsComma: z.string(),
});

export type DocsNoteFormValues = z.infer<typeof docsNoteFormSchema>;

export const docsNoteFormDefaults: DocsNoteFormValues = {
  title: '',
  bodyMarkdown: '',
  tagsComma: '',
};

export const docsCredentialFormSchema = z.object({
  label: z.string().trim().min(1, 'Label is required').max(200),
  username: z.string(),
  secretPlain: z.string().min(1, 'Secret is required').max(10_000),
  urlOrApp: z.string(),
  notesPlain: z.string(),
});

export type DocsCredentialFormValues = z.infer<typeof docsCredentialFormSchema>;

export const docsCredentialFormDefaults: DocsCredentialFormValues = {
  label: '',
  username: '',
  secretPlain: '',
  urlOrApp: '',
  notesPlain: '',
};

export const docsContactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  phonesComma: z.string(),
  emailsComma: z.string(),
  category: z.string(),
  address: z.string(),
  notes: z.string(),
});

export type DocsContactFormValues = z.infer<typeof docsContactFormSchema>;

export const docsContactFormDefaults: DocsContactFormValues = {
  name: '',
  phonesComma: '',
  emailsComma: '',
  category: '',
  address: '',
  notes: '',
};
