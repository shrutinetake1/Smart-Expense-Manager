import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../config/database';

export class NotificationController {
  static async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
      const unreadCount = await prisma.notification.count({
        where: { userId: req.user!.id, isRead: false },
      });
      res.json({ success: true, data: { notifications, unreadCount } });
    } catch (error) { next(error); }
  }

  static async markRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await prisma.notification.update({
        where: { id: req.params.id },
        data: { isRead: true },
      });
      res.json({ success: true, data: { message: 'Notification marked as read' } });
    } catch (error) { next(error); }
  }

  static async markAllRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await prisma.notification.updateMany({
        where: { userId: req.user!.id, isRead: false },
        data: { isRead: true },
      });
      res.json({ success: true, data: { message: 'All notifications marked as read' } });
    } catch (error) { next(error); }
  }

  static async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await prisma.notification.delete({ where: { id: req.params.id } });
      res.json({ success: true, data: { message: 'Notification deleted' } });
    } catch (error) { next(error); }
  }
}
