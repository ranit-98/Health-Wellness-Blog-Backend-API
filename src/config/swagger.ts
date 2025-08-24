import swaggerJSDoc from 'swagger-jsdoc';
import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Health & Wellness Blog API',
    version: '1.0.0',
    description: 'A comprehensive API for a health and wellness blog platform with user authentication, blog management, bookmarking, and newsletter functionality.',
    contact: {
      name: 'API Support',
      email: 'support@healthblog.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: process.env.BASE_URL || 'http://localhost:5000',
      description: 'Development server'
    },
    {
      url: 'https://api.healthblog.com',
      description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'User unique identifier'
          },
          name: {
            type: 'string',
            description: 'User full name'
          },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address'
          },
          role: {
            type: 'string',
            enum: ['user', 'admin'],
            description: 'User role'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Blog: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Blog unique identifier'
          },
          title: {
            type: 'string',
            description: 'Blog title'
          },
          content: {
            type: 'string',
            description: 'Blog content/body'
          },
          coverImage: {
            type: 'string',
            description: 'Blog cover image URL'
          },
          authorId: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' }
            }
          },
          category: {
            type: 'string',
            description: 'Blog category'
          },
          tags: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'Blog tags'
          },
          createdAt: {
            type: 'string',
            format: 'date-time'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Category: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            description: 'Category unique identifier'
          },
          name: {
            type: 'string',
            description: 'Category name'
          },
          description: {
            type: 'string',
            description: 'Category description'
          }
        }
      },
      Subscriber: {
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          email: {
            type: 'string',
            format: 'email'
          },
          subscribedOn: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean'
          },
          message: {
            type: 'string'
          },
          data: {
            type: 'object'
          },
          error: {
            type: 'string'
          }
        }
      },
      PaginationResponse: {
        type: 'object',
        properties: {
          page: {
            type: 'number'
          },
          limit: {
            type: 'number'
          },
          total: {
            type: 'number'
          },
          pages: {
            type: 'number'
          }
        }
      },
      DashboardStats: {
        type: 'object',
        properties: {
          stats: {
            type: 'object',
            properties: {
              totalUsers: { type: 'number' },
              totalBlogs: { type: 'number' },
              totalSubscribers: { type: 'number' },
              totalCategories: { type: 'number' }
            }
          },
          recentActivities: {
            type: 'object',
            properties: {
              recentBlogs: {
                type: 'array',
                items: { $ref: '#/components/schemas/Blog' }
              },
              recentUsers: {
                type: 'array',
                items: { $ref: '#/components/schemas/User' }
              }
            }
          }
        }
      }
    },
    responses: {
      UnauthorizedError: {
        description: 'Access token is missing or invalid',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiResponse'
            },
            example: {
              success: false,
              message: 'Access token required',
              error: 'Unauthorized'
            }
          }
        }
      },
      ForbiddenError: {
        description: 'Insufficient permissions',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiResponse'
            },
            example: {
              success: false,
              message: 'Admin access required',
              error: 'Forbidden'
            }
          }
        }
      },
      ValidationError: {
        description: 'Invalid input data',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiResponse'
            },
            example: {
              success: false,
              message: 'Validation failed',
              error: 'Title is required, Content is required'
            }
          }
        }
      },
      NotFoundError: {
        description: 'Resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiResponse'
            },
            example: {
              success: false,
              message: 'Blog not found',
              error: 'Not Found'
            }
          }
        }
      }
    }
  }
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJSDoc(options);