import type { ZodType } from 'zod';
import { z } from 'zod';

const base = '';

const apiErrorPayloadSchema = z.object({
  error: z.string().optional(),
});

async function readJsonFromResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text.length === 0) {
    return undefined;
  }
  try {
    const data: unknown = JSON.parse(text);
    return data;
  } catch {
    throw new Error(`Not JSON (${response.status}): ${text.slice(0, 80)}`);
  }
}

function errorMessageFromPayload(payload: unknown, httpStatus: number): string {
  const parsed = apiErrorPayloadSchema.safeParse(payload);
  if (parsed.success && parsed.data.error !== undefined && parsed.data.error.length > 0) {
    return parsed.data.error;
  }
  return `HTTP ${httpStatus}`;
}

/**
 * JSON request with Zod-validated success body. No type assertions on response data.
 */
export async function apiJsonValidated<T>(
  path: string,
  successSchema: ZodType<T>,
  init?: RequestInit & { json?: unknown },
): Promise<T> {
  const { json, headers: initHeaders, body, ...rest } = init ?? {};
  const headers = new Headers(initHeaders);
  if (json !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${base}${path}`, {
    ...rest,
    credentials: 'include',
    headers,
    body: json !== undefined ? JSON.stringify(json) : body,
  });

  const payload: unknown = await readJsonFromResponse(response);

  if (!response.ok) {
    throw new Error(errorMessageFromPayload(payload, response.status));
  }

  const parsedSuccess = successSchema.safeParse(payload);
  if (!parsedSuccess.success) {
    throw new Error('Unexpected response from server');
  }
  return parsedSuccess.data;
}
