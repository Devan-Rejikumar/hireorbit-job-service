import { injectable, inject } from "inversify";
import { Job, JobApplication } from "@prisma/client";
import { IJobService } from "../services/IJobService";
import { IJobRepository } from "../repositories/IJobRepository";
import { JobSearchFilters } from "../types/job";
import TYPES from "../config/types";

@injectable()
export class JobService implements IJobService {
  constructor(
    @inject(TYPES.IJobRepository) private jobRepository: IJobRepository
  ) {}

  async createJob(jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Promise<Job> {
    return this.jobRepository.createJob(jobData);
  }

  async getJobById(jobId: string): Promise<Job | null> {
    return this.jobRepository.getJobById(jobId);
  }

  async getAllJobs(): Promise<Job[]> {
    return this.jobRepository.getAllJobs();
  }

  async searchJobs(filters: JobSearchFilters): Promise<Job[]> {
    return this.jobRepository.searchJobs(filters);
  }

  async applyForJob(userId: string, jobId: string): Promise<JobApplication> {
   
    const job = await this.jobRepository.getJobById(jobId);
    if (!job) {
      throw new Error("Job not found");
    }

    
    return this.jobRepository.applyForJob(userId, jobId);
  }

  async getJobApplications(jobId: string): Promise<JobApplication[]> {
    return this.jobRepository.getJobApplications(jobId);
  }


async getJobSuggestions(query: string, limit?: number): Promise<string[]> {
  return this.jobRepository.getJobSuggestions(query, limit);
}

}
