import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { createExpenseSchema, updateExpenseSchema } from '../validations/expense.validation';

const router = Router();

router.use(authenticate);

router.get('/', ExpenseController.getAll);
router.get('/:id', ExpenseController.getById);
router.post('/', validate(createExpenseSchema), ExpenseController.create);
router.put('/:id', validate(updateExpenseSchema), ExpenseController.update);
router.delete('/:id', ExpenseController.delete);
router.post('/:id/duplicate', ExpenseController.duplicate);

export default router;
