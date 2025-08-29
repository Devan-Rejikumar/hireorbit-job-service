export interface JobResponse {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary?: string;
  jobType: string;
  requirements: string[];
  benefits: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplicationResponse {
  id: string;
  userId: string;
  jobId: string;
  status: string;
  appliedAt: Date;
}

export interface JobSearchResponse {
  jobs: JobResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}