import { Prisma } from '@proletariat-hub/database';
import { TRPCError } from '@trpc/server';

export type DomainErrorHandler = {
  returnOrThrowTRPCError: <T>(fn: () => Promise<T>) => Promise<T>;
};

export function createDomainErrorHandler(domain: string): DomainErrorHandler {
  return {
    returnOrThrowTRPCError: async <T>(fn: () => Promise<T>): Promise<T> => {
      try {
        return await fn();
      } catch (error: unknown) {
        if (error instanceof TRPCError) {
          throw error;
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new TRPCError({
              code: 'CONFLICT',
              message: `[${domain}] A record with that value already exists`,
            });
          }
          if (error.code === 'P2025') {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: `[${domain}] Record not found`,
            });
          }
          if (error.code === 'P2003') {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: `[${domain}] Referenced record does not exist`,
            });
          }

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `[${domain}] Unexpected database error (${error.code}): ${error.message}`,
          });
        }

        if (error instanceof Prisma.PrismaClientValidationError) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `[${domain}] Invalid data: ${error.message}`,
          });
        }

        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `[${domain}] Unexpected error: ${errorMessage}`,
        });
      }
    },
  };
}
