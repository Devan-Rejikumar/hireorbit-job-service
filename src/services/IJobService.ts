import { Job, JobApplication } from '@prisma/client';
import { JobSearchFilters } from '../types/job';

interface ApplicationData {
  coverLetter: string;
  expectedSalary?: string;
  availability: string;
  experience: string;
  resumeUrl?: string | null;
}

export interface IJobService {
 
  createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job>;
  getJobById(jobId: string): Promise<Job | null>;
  getAllJobs(): Promise<Job[]>;
  searchJobs(filters: JobSearchFilters): Promise<Job[]>;
  applyForJobs(jobId: string, userId: string, applicationData: ApplicationData): Promise<JobApplication>;
  getJobApplications(jobId: string): Promise<JobApplication[]>;
  getJobSuggestions(query: string, limit?: number): Promise<string[]>;
  getJobCountByCompany(companyId: string): Promise<number>;
  checkUserApplication(jobId: string, userId: string): Promise<boolean>;
}
