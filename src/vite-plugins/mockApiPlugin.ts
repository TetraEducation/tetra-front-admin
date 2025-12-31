import type { Plugin } from 'vite';
import { mockAdminLogin } from '../mocks/adminAuth';

// Plugin Vite para interceptar chamadas de API mock
export function mockApiPlugin(): Plugin {
  return {
    name: 'mock-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Intercepta POST /api/admin-login
        if (req.url === '/api/admin-login' && req.method === 'POST') {
          let body = '';
          
          req.on('data', (chunk) => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              const request = JSON.parse(body);
              const response = await mockAdminLogin(request);
              
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(response));
            } catch (error) {
              res.statusCode = 401;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                error: error instanceof Error ? error.message : 'Erro desconhecido' 
              }));
            }
          });

          return;
        }

        next();
      });
    },
  };
}

