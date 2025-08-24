# Health & Wellness Blog Backend API

A robust, scalable backend API built with TypeScript, Express.js, and MongoDB following Repository-Service-Controller architecture pattern.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Blog Management**: CRUD operations for blog posts with filtering and search
- **Bookmark System**: Users can bookmark/unbookmark blog posts
- **Category Management**: Organize blogs by categories
- **Newsletter Subscription**: Email subscription with duplicate prevention
- **Admin Panel**: Dashboard with user and content management
- **Security**: Rate limiting, CORS, helmet, input validation
- **TypeScript**: Full type safety throughout the application

## 🏗️ Architecture

```
Repository Layer    ←→    Service Layer    ←→    Controller Layer
     ↓                        ↓                      ↓
Data Access Logic    Business Logic        HTTP Request/Response
```

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation Steps

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd health-wellness-blog-backend
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Environment Variables**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/health-wellness-blog
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

4. **Database Setup**
```bash
# Make sure MongoDB is running
# The app will auto-create collections and seed initial data
```

5. **Run the Application**
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 🔐 Default Admin Credentials

The application automatically creates an admin user on first run:
- **Email**: `admin@healthblog.com`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials in production!

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |

### Blogs
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/blogs` | Get all blogs (with filters) | Public |
| GET | `/api/blogs/:id` | Get single blog | Public |
| GET | `/api/blogs/search?q=query` | Search blogs | Public |
| GET | `/api/blogs/category/:category` | Get blogs by category | Public |
| POST | `/api/blogs` | Create new blog | Admin |
| PUT | `/api/blogs/:id` | Update blog | Admin |
| DELETE | `/api/blogs/:id` | Delete blog | Admin |

### Categories
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/categories` | Get all categories | Public |
| GET | `/api/categories/:id` | Get single category | Public |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Bookmarks
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/bookmarks` | Get user bookmarks | User |
| POST | `/api/bookmarks` | Add bookmark | User |
| DELETE | `/api/bookmarks/:blogId` | Remove bookmark | User |

### Newsletter
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter | Public |
| POST | `/api/newsletter/unsubscribe` | Unsubscribe | Public |
| GET | `/api/newsletter/subscribers` | Get all subscribers | Admin |

### Admin
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/admin/dashboard` | Dashboard statistics | Admin |
| GET | `/api/admin/users` | Get all users | Admin |
| PUT | `/api/admin/users/:userId/role` | Update user role | Admin |
| DELETE | `/api/admin/users/:userId` | Delete user | Admin |
| GET | `/api/admin/blogs` | Get all blogs for admin | Admin |

## 📝 API Request/Response Examples

### User Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64f123456789abcd12345678",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Create Blog Post
```bash
POST /api/blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Benefits of Morning Exercise",
  "content": "Morning exercise has numerous benefits...",
  "category": "Exercise",
  "tags": ["fitness", "morning", "health"],
  "coverImage": "https://example.com/image.jpg"
}
```

### Get Blogs with Filters
```bash
GET /api/blogs?category=Nutrition&tags=diet,healthy&page=1&limit=5
```

### Subscribe to Newsletter
```bash
POST /api/newsletter/subscribe
Content-Type: application/json

{
  "email": "subscriber@example.com"
}
```

### Add Bookmark
```bash
POST /api/bookmarks
Authorization: Bearer <token>
Content-Type: application/json

{
  "blogId": "64f123456789abcd12345678"
}
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  bookmarks: [ObjectId], // Array of Blog IDs
  createdAt: Date,
  updatedAt: Date
}
```

### Blogs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  content: String,
  coverImage: String,
  authorId: ObjectId (ref: User),
  category: String,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Categories Collection
```javascript
{
  _id: ObjectId,
  name: String (unique),
  description: String
}
```

### Subscribers Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  subscribedOn: Date
}
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **Rate Limiting**: Prevents spam and abuse
- **CORS Protection**: Configured for specific origins
- **Helmet.js**: Security headers
- **Input Validation**: Express-validator for request validation
- **Role-based Access**: Admin and user role separation

## 🧪 Testing

### Manual Testing with Postman/cURL

1. **Health Check**
```bash
GET http://localhost:5000/health
```

2. **Register Admin/User**
```bash
POST http://localhost:5000/api/auth/register
```

3. **Login and Get Token**
```bash
POST http://localhost:5000/api/auth/login
```

4. **Test Protected Routes**
```bash
GET http://localhost:5000/api/admin/dashboard
Authorization: Bearer <your-token>
```

### Test Data
The application automatically seeds:
- Admin user credentials
- Sample categories (Nutrition, Mental Health, Exercise, Sleep, Lifestyle)
- Sample blog posts

## 🚀 Deployment

### Production Environment Setup

1. **Environment Variables**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-production-secret-key-32-characters
JWT_EXPIRE=7d
FRONTEND_URL=https://yourdomain.com
```

2. **Build and Start**
```bash
npm run build
npm start
```

### Docker Support (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
```

## 📁 Project Structure
```
src/
├── config/          # Database and app configuration
├── controllers/     # HTTP request handlers
├── middleware/      # Auth, validation, error handling
├── models/          # MongoDB schemas
├── repositories/    # Data access layer
├── routes/          # API route definitions
├── services/        # Business logic layer
├── types/           # TypeScript type definitions
├── utils/           # Helper functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## 🔧 Extending the Application

### Adding New Features

1. **Create Model** (if new entity)
2. **Create Repository** (data access)
3. **Create Service** (business logic)
4. **Create Controller** (HTTP handlers)
5. **Create Routes** (endpoint definitions)
6. **Add Middleware** (if needed)

### Example: Adding Comments Feature

```typescript
// 1. Model
interface IComment {
  blogId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

// 2. Repository
class CommentRepository extends BaseRepository<IComment> {
  async findByBlogId(blogId: string) {
    return this.model.find({ blogId }).populate('userId', 'name');
  }
}

// 3. Service
class CommentService {
  async addComment(blogId: string, userId: string, content: string) {
    return this.commentRepository.create({ blogId, userId, content });
  }
}

// 4. Controller & Routes
// Follow the same pattern as existing controllers
```

## 📞 Support & Contributing

### Common Issues
1. **MongoDB Connection**: Ensure MongoDB is running and URI is correct
2. **JWT Errors**: Check JWT_SECRET is set in environment
3. **CORS Issues**: Verify FRONTEND_URL matches your client URL
4. **Port Conflicts**: Change PORT in .env if 5000 is occupied

### Performance Tips
1. **Database Indexing**: Already implemented for common queries
2. **Pagination**: Built-in pagination for large datasets
3. **Caching**: Consider Redis for production scaling
4. **Rate Limiting**: Adjust limits based on your needs

### Next Steps for Students
1. Add file upload for blog images
2. Implement email sending for newsletter
3. Add comment system
4. Implement blog sharing functionality
5. Add analytics and reporting
6. Create comprehensive test suite

## 📄 License
This project is created for educational purposes.