import { Router } from 'express';
import { createStatus, getStats } from '../controllers/statsController';

const router = Router();

router.post('/create/:status', createStatus);
router.get('/stats/status', getStats);

export default router;