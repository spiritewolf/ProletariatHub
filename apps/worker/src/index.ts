import { validateEnv } from '@proletariat-hub/config';

const env = validateEnv();
console.info(`[Worker] Ready. Environment: ${env.NODE_ENV}`);

let isShuttingDown = false;

function shutdown(signal: NodeJS.Signals) {
  if (isShuttingDown) {
    process.exit(1);
  }
  isShuttingDown = true;
  console.info(`[Worker] Shutting down (${signal})`);
  process.exit(0);
}

process.on('SIGINT', () => {
  shutdown('SIGINT');
});
process.on('SIGTERM', () => {
  shutdown('SIGTERM');
});
