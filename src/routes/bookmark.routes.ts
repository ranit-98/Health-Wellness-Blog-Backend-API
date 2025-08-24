import { Router } from 'express';
import { BookmarkController } from '../controllers/bookmark.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const bookmarkController = new BookmarkController();

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: User bookmark management endpoints
 */

/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Get user's bookmarked blogs
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookmarks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Blog'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   post:
 *     summary: Add a blog to bookmarks
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blogId
 *             properties:
 *               blogId:
 *                 type: string
 *                 description: ID of the blog to bookmark
 *                 example: "64f123456789abcd12345678"
 *     responses:
 *       200:
 *         description: Blog bookmarked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: Blog bookmarked successfully
 *       400:
 *         description: Invalid blog ID or blog not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: Blog not found
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', authenticateToken, bookmarkController.getUserBookmarks);
router.post('/', authenticateToken, bookmarkController.addBookmark);

/**
 * @swagger
 * /api/bookmarks/{blogId}:
 *   delete:
 *     summary: Remove a blog from bookmarks
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the blog to remove from bookmarks
 *         example: "64f123456789abcd12345678"
 *     responses:
 *       200:
 *         description: Bookmark removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: Bookmark removed successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/:blogId', authenticateToken, bookmarkController.removeBookmark);

export default router;
