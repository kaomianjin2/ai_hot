import Fastify from 'fastify';
import { hotItemsRoutes } from './routes/hotItems.js';

const app = Fastify({ logger: false });

app.get('/health', async () => {
  return { status: 'ok' };
});

app.register(hotItemsRoutes);

const start = async () => {
  try {
    await app.listen({ host: '0.0.0.0', port: 3000 });
    console.log('Server is running on http://0.0.0.0:3000');
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
