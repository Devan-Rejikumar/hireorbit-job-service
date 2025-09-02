
import { Prisma, PrismaClient, Job, JobApplication } from "@prisma/client";
import { JobSearchFilters } from "../types/job";

export interface IJobRepository {
  createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job>;
  getJobById(jobId: string): Promise<Job | null>;
  getAllJobs(): Promise<Job[]>;
  searchJobs(filters: JobSearchFilters): Promise<Job[]>;
  

  applyForJob(userId: string, jobId: string): Promise<JobApplication>;
  getJobApplications(jobId: string): Promise<JobApplication[]>;
  getJobSuggestions(query: string, limit?: number): Promise<string[]>;
  countByCompany(companyId: string): Promise<number>;
  
}
