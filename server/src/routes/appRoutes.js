import { Router } from 'express';
import {
  createApplication,
  deleteApplication,
  exportCsv,
  getApplication,
  getStats,
  listApplications,
  updateApplication
} from '../controllers/appsController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { applicationSchema, applicationUpdateSchema } from '../validators/appValidators.js';

const router = Router();

router.use(requireAuth);

router.get('/', listApplications);
router.post('/', validateRequest(applicationSchema), createApplication);
router.get('/stats', getStats);
router.get('/export', exportCsv);
router.get('/:id', getApplication);
router.put('/:id', validateRequest(applicationUpdateSchema), updateApplication);
router.delete('/:id', deleteApplication);

export default router;
