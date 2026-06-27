import { Router } from 'express';
import { IncomeController } from '../controllers/income.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/', IncomeController.getAll);
router.get('/:id', IncomeController.getById);
router.post('/', IncomeController.create);
router.put('/:id', IncomeController.update);
router.delete('/:id', IncomeController.delete);

export default router;
