import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
router.use(authenticate);

router.get('/', NotificationController.getAll);
router.put('/:id/read', NotificationController.markRead);
router.put('/read-all', NotificationController.markAllRead);
router.delete('/:id', NotificationController.delete);

export default router;
