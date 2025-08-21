import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import TYPES from "../config/types";
import { IJobService } from "../services/IJobService";
import { HttpStatusCode, AuthStatusCode, JobStatusCode, ValidationStatusCode, ApplicationStatusCode } from '../enums/StatusCodes';

@injectable()
export class JobController {
  constructor(@inject(TYPES.IJobService) private jobService: IJobService) {}

  async createJob(req: Request, res: Response): Promise<void> {
    try {
      const jobData = req.body;
      const job = await this.jobService.createJob(jobData);
      res.status(JobStatusCode.JOB_CREATED).json({ job });
    } catch (error: any) {
      res.status(ValidationStatusCode.VALIDATION_ERROR).json({ error: error.message });
    }
  }

  async getAllJobs(req: Request, res: Response): Promise<void> {
    try {
      const jobs = await this.jobService.getAllJobs();
      res.status(JobStatusCode.JOBS_RETRIEVED).json({ jobs });
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  async getJobById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const jobs = await this.jobService.getJobById(id);
      if (!jobs) {
        res.status(JobStatusCode.JOB_NOT_FOUND).json({ error: "Job not found" });
        return;
      }
      res.status(JobStatusCode.JOB_RETRIEVED).json({ jobs });
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  async searchJobs(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const jobs = await this.jobService.searchJobs(filters);
      res.status(JobStatusCode.JOBS_SEARCHED).json({ jobs });
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  async applyForJobs(req: Request, res: Response): Promise<void> {
    try {
      const { id: jobId } = req.params;
      const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(AuthStatusCode.USER_NOT_AUTHENTICATED).json({ error: "User not authenticated" });
        return;
      }
      const application = await this.jobService.applyForJob(userId, jobId);
      res.status(ApplicationStatusCode.APPLICATION_SUCCESS).json({ application });
    } catch (error: any) {
      if (error.code === "P2002") {
        res.status(ApplicationStatusCode.DUPLICATE_APPLICATION).json({ error: "You have already applied for this job" });
      } else {
        res.status(ValidationStatusCode.VALIDATION_ERROR).json({ error: error.message });
      }
    }
  }

  async getJobApplications(req: Request, res: Response): Promise<void> {
    try {
      const { id: jobId } = req.params;
      const applications = await this.jobService.getJobApplications(jobId);
      res.status(JobStatusCode.APPLICATIONS_RETRIEVED).json({ applications });
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  async getJobSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        res.status(ValidationStatusCode.QUERY_PARAMETER_REQUIRED).json({ error: "Query parameter 'q' is required" });
        return;
      }
      const suggestions = await this.jobService.getJobSuggestions(q);
      res.status(JobStatusCode.SUGGESTIONS_RETRIEVED).json({ suggestions });
    } catch (error: any) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
}
