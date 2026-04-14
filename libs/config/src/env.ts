import { z } from 'zod';

/** Canonical `NODE_ENV` values (compare with `env.NODE_ENV`). */
export const DEPLOYMENT_ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

export type DeploymentEnv = (typeof DEPLOYMENT_ENV)[keyof typeof DEPLOYMENT_ENV];

export const serverEnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().min(32),
  NODE_ENV: z
    .enum([DEPLOYMENT_ENV.DEVELOPMENT, DEPLOYMENT_ENV.PRODUCTION, DEPLOYMENT_ENV.TEST])
    .default(DEPLOYMENT_ENV.DEVELOPMENT),
  PORT: z.coerce.number().default(3000),
  WEB_ORIGIN: z.string().url(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function validateEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:', result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}
