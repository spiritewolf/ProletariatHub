export const DocsApiPaths = {
  notes: '/api/docs/notes',
  note: (id: string) => `/api/docs/notes/${id}`,
  credentials: '/api/docs/credentials',
  credential: (id: string) => `/api/docs/credentials/${id}`,
  credentialReveal: (id: string) => `/api/docs/credentials/${id}/reveal`,
  contacts: '/api/docs/contacts',
  contact: (id: string) => `/api/docs/contacts/${id}`,
  serviceTiles: '/api/service-tiles',
  serviceTile: (id: string) => `/api/service-tiles/${id}`,
} as const;
