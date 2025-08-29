import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import TYPES from "../config/types";
import { IJobService } from "../services/IJobService";
import { HttpStatusCode, AuthStatusCode, JobStatusCode, ValidationStatusCode, ApplicationStatusCode } from '../enums/StatusCodes';
import { CreateJobSchema, JobApplicationSchema, JobSearchSchema, JobSuggestionsSchema } from "../dto/schemas/job.schema";
import { buildErrorResponse, buildSuccessResponse } from "shared-dto";

@injectable()
export class JobController {
  constructor(@inject(TYPES.IJobService) private jobService: IJobService) {}

  async createJob(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = CreateJobSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(ValidationStatusCode.VALIDATION_ERROR).json(
          buildErrorResponse('Validation failed', validationResult.error.message)
        );
        return;
      }
      const jobData = validationResult.data;
      
      const job = await this.jobService.createJob(jobData);
      res.status(JobStatusCode.JOB_CREATED).json(
        buildSuccessResponse({ job }, 'Job created successfully')
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
        buildErrorResponse('Job creation failed', errorMessage)
      );
    }
  }


async getAllJobs(req: Request, res: Response): Promise<void> {
  try {
    const jobs = await this.jobService.getAllJobs();
    res.status(JobStatusCode.JOBS_RETRIEVED).json({ jobs });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
      buildErrorResponse('Failed to retrieve jobs', errorMessage)
    );
  }
}

  async getJobById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(ValidationStatusCode.MISSING_REQUIRED_FIELDS).json(
          buildErrorResponse('Job ID is required', 'Missing job ID parameter')
        );
        return;
      }
      
      const job = await this.jobService.getJobById(id);
      
      if (!job) {
        res.status(JobStatusCode.JOB_NOT_FOUND).json(
          buildErrorResponse('Job not found', 'No job found with the provided ID')
        );
        return;
      }
      
      res.status(JobStatusCode.JOB_RETRIEVED).json(
        buildSuccessResponse({ job }, 'Job retrieved successfully')
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
        buildErrorResponse('Failed to retrieve job', errorMessage)
      );
    }
  }

  async searchJobs(req: Request, res: Response): Promise<void> {
    try {
      const searchValidation = JobSearchSchema.safeParse(req.query);
      
      if (!searchValidation.success) {
        res.status(ValidationStatusCode.VALIDATION_ERROR).json(
          buildErrorResponse('Validation failed', searchValidation.error.message)
        );
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const jobs = await this.jobService.searchJobs(searchValidation.data);
      
      res.status(JobStatusCode.JOBS_SEARCHED).json(
        buildSuccessResponse({ jobs }, 'Jobs found successfully')
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
        buildErrorResponse('Job search failed', errorMessage)
      );
    }
  }

  async applyForJobs(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = JobApplicationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        res.status(ValidationStatusCode.VALIDATION_ERROR).json(
          buildErrorResponse('Validation failed', validationResult.error.message)
        );
        return;
      }
      
      const { jobId, userId } = validationResult.data;
      
      const application = await this.jobService.applyForJobs(jobId, userId);
      
      res.status(ApplicationStatusCode.APPLICATION_SUCCESS).json(
        buildSuccessResponse({ application }, 'Job application submitted successfully')
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
        buildErrorResponse('Job application failed', errorMessage)
      );
    }
  }

  async getJobApplications(req: Request, res: Response): Promise<void> {
    try {
      const { id: jobId } = req.params;
      
      if (!jobId) {
        res.status(ValidationStatusCode.MISSING_REQUIRED_FIELDS).json(
          buildErrorResponse('Job ID is required', 'Missing job ID parameter')
        );
        return;
      }
      
      const applications = await this.jobService.getJobApplications(jobId);
      
      res.status(JobStatusCode.APPLICATIONS_RETRIEVED).json(
        buildSuccessResponse({ applications }, 'Job applications retrieved successfully')
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
        buildErrorResponse('Failed to retrieve job applications', errorMessage)
      );
    }
  }

  async getJobSuggestions(req: Request, res: Response): Promise<void> {
    try {
      const validationResult = JobSuggestionsSchema.safeParse(req.query);
      if (!validationResult.success) {
        res.status(ValidationStatusCode.VALIDATION_ERROR).json(
          buildErrorResponse('Validation failed', validationResult.error.message)
        );
        return;
      }
      const { q } = validationResult.data;
      const suggestions = await this.jobService.getJobSuggestions(q);
      
      res.status(JobStatusCode.SUGGESTIONS_RETRIEVED).json(
        buildSuccessResponse({ suggestions }, 'Job suggestions retrieved successfully')
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
        buildErrorResponse('Failed to get job suggestions', errorMessage)
      );
    }
  }
}