import { Router } from 'express';
import { BlogController } from '../controllers/blog.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();
const blogController = new BlogController();

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management endpoints
 */

/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blogs with optional filters
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *         example: Nutrition
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter by tags (comma-separated)
 *         example: diet,healthy
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and content
 *         example: meditation
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of blogs per page
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         blogs:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Blog'
 *                         pagination:
 *                           $ref: '#/components/schemas/PaginationResponse'
 */
router.get('/', blogController.getAllBlogs);

/**
 * @swagger
 * /api/blogs/search:
 *   get:
 *     summary: Search blogs
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *         example: meditation
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         blogs:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Blog'
 *                         pagination:
 *                           $ref: '#/components/schemas/PaginationResponse'
 *       400:
 *         description: Search query is required
 */
router.get('/search', blogController.searchBlogs);

/**
 * @swagger
 * /api/blogs/category/{category}:
 *   get:
 *     summary: Get blogs by category
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Category name
 *         example: Nutrition
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         blogs:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Blog'
 *                         pagination:
 *                           $ref: '#/components/schemas/PaginationResponse'
 */
router.get('/category/:category', blogController.getBlogsByCategory);

/**
 * @swagger
 * /api/blogs/{id}:
 *   get:
 *     summary: Get a single blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *         example: 64f123456789abcd12345678
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         blog:
 *                           $ref: '#/components/schemas/Blog'
 *                         relatedBlogs:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Blog'
 *                           description: Related blogs based on category and tags
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
router.get('/:id', blogController.getBlogById);

/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog post (Admin only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 description: Blog title
 *                 example: "10 Tips for Better Sleep Hygiene"
 *               content:
 *                 type: string
 *                 description: Blog content
 *                 example: "Good sleep hygiene is essential for overall health..."
 *               coverImage:
 *                 type: string
 *                 description: Cover image URL
 *                 example: "https://example.com/sleep-tips.jpg"
 *               category:
 *                 type: string
 *                 description: Blog category
 *                 example: "Sleep"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Blog tags
 *                 example: ["sleep", "wellness", "health"]
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Blog'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post('/', authenticateToken, requireAdmin, blogController.createBlog);

/**
 * @swagger
 * /api/blogs/{id}:
 *   put:
 *     summary: Update a blog post (Admin only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               coverImage:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Blog'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *   delete:
 *     summary: Delete a blog post (Admin only)
 *     tags: [Blogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.put('/:id', authenticateToken, requireAdmin, blogController.updateBlog);
router.delete('/:id', authenticateToken, requireAdmin, blogController.deleteBlog);

export default router;
