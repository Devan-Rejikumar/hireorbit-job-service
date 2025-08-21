import { Router } from "express";
import container from "../config/inversify.config";
import TYPES from "../config/types";
import { JobController } from "../controllers/JobController";

const router = Router();
const jobController = container.get<JobController>(TYPES.JobController);


router.post("/", (req, res) => jobController.createJob(req, res));
router.get("/", (req, res) => jobController.getAllJobs(req, res));
router.get("/search", (req, res) => jobController.searchJobs(req, res));
router.get("/:id", (req, res) => jobController.getJobById(req, res));


router.get('/suggestions', (req, res) => jobController.getJobSuggestions(req, res));
router.post("/:id/apply", (req, res) => jobController.applyForJobs(req, res));
router.get("/:id/applications", (req, res) => jobController.getJobApplications(req, res));




export default router;
