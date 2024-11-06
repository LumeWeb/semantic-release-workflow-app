import { z } from 'zod';

export const tokenSchema = z.string().min(1, 'GitHub token is required');

export const releaseFormSchema = z.object({
  organization: z.string().min(1, 'Organization is required'),
  repository: z.string().min(1, 'Repository is required'),
  type: z.enum(['patch', 'minor', 'major'], {
    required_error: 'Version type is required',
  }),
  description: z.string().min(1, 'Change description is required'),
});

export type ReleaseFormData = z.infer<typeof releaseFormSchema>;