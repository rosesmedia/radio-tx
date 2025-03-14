import { exit } from 'process';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PUBLIC_URL: z
    .string()
    .refine((s) => !s.endsWith('/'), 'PUBLIC_URL must not end with a `/`'),
  HLS_SEGMENTS_URL: z
    .string()
    .refine(
      (s) => !s.endsWith('/'),
      'HLS_SEGMENTS_URL must not end with a `/`'
    ),
  STREAM_CONTROLLER_URL: z
    .string()
    .refine(
      (s) => !s.endsWith('/'),
      'STREAM_CONTROLLER_URL most not end with a `/`'
    )
    .optional(),
  DASHBOARD_USER: z.string(),
  DASHBOARD_PASS: z.string(),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export function validateEnv(
  env?: any
): NodeJS.ProcessEnv | z.infer<typeof envSchema> {
  /* eslint-enable @typescript-eslint/no-explicit-any */
  if (process.env.SKIP_ENV_VALIDATION === '1') return process.env;
  const envResult = envSchema.safeParse(env ?? process.env);
  if (!envResult.success) {
    console.error('Error: Bad env configuration');
    for (const error of envResult.error.issues) {
      console.error(
        `   variable ${error.path.join('.')} ${error.code}, ${error.message}`
      );
    }
    exit(1);
  }
  return envResult.data;
}

export const env = validateEnv();
