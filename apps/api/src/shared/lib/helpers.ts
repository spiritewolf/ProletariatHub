import { TRPCError } from '@trpc/server';

function isValueForConstEnum<T extends Record<string, string>>(
  enumObj: T,
  value: string,
): value is T[keyof T] {
  for (const allowed of Object.values(enumObj)) {
    if (allowed === value) {
      return true;
    }
  }
  return false;
}

export function validateConstEnumType<T extends Record<string, string>>(
  enumObj: T,
  value: string,
  label: string,
): T[keyof T] {
  if (isValueForConstEnum(enumObj, value)) {
    return value;
  }
  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: `Invalid ${label} data`,
  });
}
