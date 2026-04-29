import type { FastifyPluginAsync } from 'fastify';
import { getNotifications, markAsRead, markAllAsRead } from '../services/notifications.js';

export const notificationsRoutes: FastifyPluginAsync = async (app) => {
  app.get<{
    Querystring: { unreadOnly?: string };
  }>('/api/notifications', async (request, reply) => {
    const unreadOnly = request.query.unreadOnly === 'true';
    const notifications = getNotifications({ unreadOnly });
    return reply.send(notifications);
  });

  app.patch<{ Params: { id: string } }>('/api/notifications/:id/read', async (request, reply) => {
    const success = markAsRead(request.params.id);
    if (!success) {
      return reply.status(404).send({ error: 'Not found or already read' });
    }
    return reply.status(200).send({ ok: true });
  });

  app.patch('/api/notifications/read-all', async (_request, reply) => {
    const count = markAllAsRead();
    return reply.send({ updated: count });
  });
};
