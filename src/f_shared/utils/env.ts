import { z } from 'zod';

const EnvSchema = z.object({
  BASE_URL: z.httpUrl(),
});

const env = EnvSchema.parse(process.env);

export { env };
