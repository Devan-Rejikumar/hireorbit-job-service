import { z } from 'zod';

export const CreateJobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  jobType: z.string().min(1, 'Job type is required'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is needed'),
  salary: z.string().nullable(),
  benefits: z.array(z.string()).optional().default([]),
  isActive: z.boolean().default(true)
});

export const JobSearchSchema = z.object({
  title: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship']).optional(),
});

export const PaginationSchema = z.object({
  page: z.number().min(1, 'Page must be at least 1').default(1),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(10)
});

export const JobApplicationSchema = z.object({
  userId: z.string().uuid('Invalid user ID')
});

export const JobSuggestionsSchema = z.object({
  q: z.string().min(1, 'Query parameter is required')
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type JobSearchInput = z.infer<typeof JobSearchSchema>;
export type JobApplicationInput = z.infer<typeof JobApplicationSchema>;
export type JobSuggestionsInput = z.infer<typeof JobSuggestionsSchema>;