import { injectable, inject } from 'inversify';
import { Job, JobApplication } from '@prisma/client';
import { IJobService, UpdateJobInput } from '../services/IJobService';
import { IJobRepository } from '../repositories/IJobRepository';
import { JobSearchFilters } from '../types/job';
import TYPES from '../config/types';

interface ApplicationData {
  coverLetter: string;
  expectedSalary?: string;
  availability: string;
  experience: string;
  resumeUrl?: string | null;
}

@injectable()
export class JobService implements IJobService {
  constructor(
    @inject(TYPES.IJobRepository) private jobRepository: IJobRepository,
  ) { }

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

  async applyForJobs(jobId: string, userId: string, applicationData: ApplicationData): Promise<JobApplication> {
    const job = await this.jobRepository.getJobById(jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    return this.jobRepository.applyForJob(userId, jobId, applicationData);
  }

  async getJobApplications(jobId: string): Promise<JobApplication[]> {
    return this.jobRepository.getJobApplications(jobId);
  }

  async getJobSuggestions(query: string, limit?: number): Promise<string[]> {
    return this.jobRepository.getJobSuggestions(query, limit);
  }

  async getJobCountByCompany(companyId: string): Promise<number> {
    console.log('JobService: getJobCountByCompany called with companyId =', companyId);
    const count = await this.jobRepository.countByCompany(companyId);
    console.log('JobService: count returned =', count);
    return count;
  }

  async checkUserApplication(jobId: string, userId: string): Promise<boolean> {
    console.log('JobService: checkUserApplication called with jobId =', jobId, 'userId =', userId);
    const hasApplied = await this.jobRepository.checkUserApplication(jobId, userId);
    console.log('JobService: hasApplied =', hasApplied);
    return hasApplied;
  }

  async getJobsByCompany(companyId: string): Promise<Job[]> {
    return this.jobRepository.getJobsByCompany(companyId);
  }

  async updateJob(id: string, jobData: UpdateJobInput): Promise<Job> {
    return this.jobRepository.updateJob(id,jobData);
  }

  async deleteJob(id: string): Promise<void> {
    return this.jobRepository.deleteJob(id);
  }
}
