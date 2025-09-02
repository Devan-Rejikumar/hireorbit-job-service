import { injectable } from "inversify";
// import { PrismaClient } from "../../generated/prisma";
import { Job, JobApplication, PrismaClient } from "@prisma/client";
import { IJobRepository } from "./IJobRepository";
import { JobSearchFilters } from "../types/job";

const prisma = new PrismaClient();

@injectable()
export class JobRepository implements IJobRepository {
  async createJob(
    jobData: Omit<Job, "id" | "createdAt" | "updatedAt">
  ): Promise<Job> {
    return prisma.job.create({
      data: jobData,
    });
  }

  async getJobById(jobId: string): Promise<Job | null> {
    return prisma.job.findUnique({
      where: { id: jobId },
    });
  }

  async getAllJobs(): Promise<Job[]> {
    return prisma.job.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async searchJobs(filters: JobSearchFilters): Promise<Job[]> {
    const hasFilters =
      filters.title || filters.company || filters.location || filters.jobType;

    if (!hasFilters) {
      return [];
    }

    const whereClause: any = {
      isActive: true,
    };

    if (filters.title) {
      whereClause.title = { contains: filters.title, mode: "insensitive" };
    }

    if (filters.company) {
      whereClause.company = { contains: filters.company, mode: "insensitive" };
    }

    if (filters.location) {
      whereClause.location = {
        contains: filters.location,
        mode: "insensitive",
      };
    }

    if (filters.jobType) {
      whereClause.jobType = filters.jobType;
    }

    return prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
  }

  async applyForJob(userId: string, jobId: string): Promise<JobApplication>{
    const existingApplication = await prisma.jobApplication.findUnique({
      where:{userId_jobId:{userId,jobId}}
    });
    if(existingApplication){
      throw new Error('You have already applied for this job')
    }
    return prisma.jobApplication.create({data:{userId,jobId,status:'pending',}})
  }

  async getJobApplications(jobId: string): Promise<JobApplication[]> {
    return prisma.jobApplication.findMany({
      where: { jobId },
    });
  }

  async getJobSuggestions(
    query: string,
    limit: number = 10
  ): Promise<string[]> {
    const jobs = await prisma.job.findMany({
      where: {
        isActive: true,
        title: { contains: query, mode: "insensitive" },
      },
      select: { title: true },
      distinct: ["title"],
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return jobs.map((job) => job.title);
  }

  async countByCompany(companyId: string): Promise<number> {
    console.log('🔍 JobRepository: countByCompany called with companyId =', companyId);
    const count = await prisma.job.count({
      where: { company: companyId, isActive: true }
    });
    console.log('🔍 JobRepository: count =', count);
    return count;
  }

}
