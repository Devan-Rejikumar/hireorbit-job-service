import { Router } from 'express';
import container from '../config/inversify.config';
import TYPES from '../config/types';
import { JobController } from '../controllers/JobController';

const router = Router();
const jobController = container.get<JobController>(TYPES.JobController);

router.use((req, res, next) => {
  console.log(`Job Routes: ${req.method} ${req.url}`);
  console.log('Job Routes: Body:', req.body);
  next();
});

router.get('/test-controller', (req, res) => {
  console.log('Test route hit');
  res.json({ message: 'Controller test successful' });
});

router.post('/test-apply', (req, res) => {
  console.log('Test apply route hit');
  console.log('Test apply body:', req.body);
  jobController.applyForJobs(req, res);
});

router.post('/', (req, res) => jobController.createJob(req, res));
router.get('/', (req, res) => jobController.getAllJobs(req, res));
router.get('/search', (req, res) => jobController.searchJobs(req, res));
router.get('/company/:companyId/count', (req, res) => jobController.getJobCountByCompany(req, res));
router.get('/:id', (req, res) => jobController.getJobById(req, res));

router.get('/suggestions', (req, res) => jobController.getJobSuggestions(req, res));
// router.post("/:id/apply", (req, res) => jobController.applyForJobs(req, res));
router.post('/:id/apply', (req, res) => {
  console.log(`Job Routes: Apply route hit for job ${req.params.id}`);
  console.log('Job Routes: Request body:', req.body);
  jobController.applyForJobs(req, res);
});
router.get('/:id/applications', (req, res) => jobController.getJobApplications(req, res));
router.get('/:id/application-status', (req, res) => jobController.checkApplicationStatus(req, res));

export default router;
