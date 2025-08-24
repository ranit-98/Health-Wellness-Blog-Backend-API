import { Router } from 'express';
import { NewsletterController } from '../controllers/newsletter.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();
const newsletterController = new NewsletterController();

// POST /api/newsletter/subscribe - Subscribe to newsletter (public)
router.post('/subscribe', newsletterController.subscribe);

// POST /api/newsletter/unsubscribe - Unsubscribe from newsletter (public)
router.post('/unsubscribe', newsletterController.unsubscribe);

// GET /api/newsletter/subscribers - Get all subscribers (admin only)
router.get('/subscribers', authenticateToken, requireAdmin, newsletterController.getAllSubscribers);

export default router;