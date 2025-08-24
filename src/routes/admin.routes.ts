import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// GET /api/admin/dashboard - Get dashboard statistics
router.get('/dashboard', adminController.getDashboard);

// GET /api/admin/users - Get all users
router.get('/users', adminController.getAllUsers);

// PUT /api/admin/users/:userId/role - Update user role
router.put('/users/:userId/role', adminController.updateUserRole);

// DELETE /api/admin/users/:userId - Delete user
router.delete('/users/:userId', adminController.deleteUser);

// GET /api/admin/blogs - Get all blogs for admin
router.get('/blogs', adminController.getAllBlogsForAdmin);

export default router;
