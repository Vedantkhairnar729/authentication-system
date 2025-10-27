import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Authentication System API',
      version: '1.0.0',
      description: 'Complete authentication system with JWT, 2FA, social login, and more',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server'
      },
      {
        url: 'https://your-production-url.com/api',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            username: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin', 'moderator'] },
            isEmailVerified: { type: 'boolean' },
            twoFactorEnabled: { type: 'boolean' },
            avatar: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'username', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            username: { type: 'string', minLength: 3, maxLength: 20 },
            password: { type: 'string', minLength: 6 }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            twoFactorCode: { type: 'string' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            token: { type: 'string' }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Email Verification',
        description: 'Email verification endpoints'
      },
      {
        name: 'Password Reset',
        description: 'Password reset functionality'
      },
      {
        name: '2FA',
        description: 'Two-factor authentication'
      },
      {
        name: 'Social Login',
        description: 'OAuth authentication (Google, GitHub)'
      },
      {
        name: 'Profile',
        description: 'User profile management'
      },
      {
        name: 'Activity',
        description: 'User activity logs'
      },
      {
        name: 'Sessions',
        description: 'Session management'
      },
      {
        name: 'Admin',
        description: 'Admin-only endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Auth API Documentation'
  }));

  // Serve raw JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

export default swaggerSpec;
