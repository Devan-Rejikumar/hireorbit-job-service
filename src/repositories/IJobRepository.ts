
import { Prisma, PrismaClient, Job, JobApplication } from '@prisma/client';
import { JobSearchFilters } from '../types/job';
import { UpdateJobInput } from '../services/IJobService';

interface ApplicationData {
  coverLetter: string;
  expectedSalary?: string;
  availability: string;
  experience: string;
  resumeUrl?: string | null;
}

export interface IJobRepository {
  createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job>;
  getJobById(jobId: string): Promise<Job | null>;
  getAllJobs(): Promise<Job[]>;
  searchJobs(filters: JobSearchFilters): Promise<Job[]>;
  applyForJob(userId: string, jobId: string, applicationData: ApplicationData): Promise<JobApplication>;
  getJobApplications(jobId: string): Promise<JobApplication[]>;
  getJobSuggestions(query: string, limit?: number): Promise<string[]>;
  countByCompany(companyId: string): Promise<number>;
  checkUserApplication(jobId: string, userId: string): Promise<boolean>;
  getJobsByCompany(companyId: string): Promise<Job[]>;
  updateJob(id: string, jobData: UpdateJobInput): Promise<Job>;
  deleteJob(id: string): Promise<void>;
}
