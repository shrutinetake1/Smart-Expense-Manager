import { Router } from 'express';
import { GoalController } from '../controllers/goal.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/', GoalController.getAll);
router.get('/:id', GoalController.getById);
router.post('/', GoalController.create);
router.put('/:id', GoalController.update);
router.post('/:id/contribute', GoalController.contribute);
router.delete('/:id', GoalController.delete);

export default router;
