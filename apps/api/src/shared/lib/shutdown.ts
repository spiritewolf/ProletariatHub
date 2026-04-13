import type { FastifyInstance } from 'fastify';

export function registerShutdown(
  server: FastifyInstance,
  cleanupFns: Array<() => Promise<void>>,
): void {
  let isShuttingDown = false;

  async function shutdown(signal: NodeJS.Signals): Promise<void> {
    if (isShuttingDown) {
      process.exit(1);
    }
    isShuttingDown = true;
    server.log.info({ signal }, 'Shutting down');
    try {
      await server.close();
      for (const fn of cleanupFns) {
        await fn();
      }
    } catch (err: unknown) {
      server.log.error(err);
    }
    process.exit(0);
  }

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
}
