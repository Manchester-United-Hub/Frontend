import { z } from 'zod';

const EnvSchema = z.object({
  BASE_URL: z.string().url(),
});

const env = EnvSchema.parse(process.env);

export { env };
