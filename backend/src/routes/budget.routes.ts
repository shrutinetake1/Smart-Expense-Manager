import { Router } from 'express';
import { BudgetController } from '../controllers/budget.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/', BudgetController.getAll);
router.post('/', BudgetController.create);
router.put('/:id', BudgetController.update);
router.delete('/:id', BudgetController.delete);

export default router;
