import type {
  ContactListItem,
  CredentialListItem,
  ReferenceNoteListItem,
} from '@proletariat-hub/contracts';

export function formatNoteMeta(note: ReferenceNoteListItem): string {
  const tagSeg = note.tags.length > 0 ? note.tags.join(', ') : 'no tags';
  return (
    new Date(note.updatedAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }) + ` · ${tagSeg}`
  );
}

export function formatCredentialMeta(c: CredentialListItem): string {
  const u = c.username != null && c.username.length > 0 ? c.username : '—';
  const url = c.urlOrApp != null && c.urlOrApp.length > 0 ? ` · ${c.urlOrApp}` : '';
  return `${u}${url}`;
}

export function formatContactMeta(c: ContactListItem): string {
  const p = c.phones.length > 0 ? c.phones.join(', ') : 'no phones';
  const e = c.emails.length > 0 ? ` · ${c.emails.join(', ')}` : '';
  return `${p}${e}`;
}
