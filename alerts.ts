import { Router } from 'express';
import { db } from '../../db/index';
import { alerts } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';

export const alertsRouter = Router();

alertsRouter.get('/', async (req, res) => {
  try {
    const statusParam = req.query.status as string | undefined;
    if (statusParam) {
      const filtered = await db
        .select()
        .from(alerts)
        .where(eq(alerts.status, statusParam))
        .orderBy(desc(alerts.createdAt));
      return res.json(filtered);
    }
    const allAlerts = await db.select().from(alerts).orderBy(desc(alerts.createdAt));
    res.json(allAlerts);
  } catch (err) {
    console.error('Failed to fetch alerts:', err);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

alertsRouter.post('/:id/resolve', async (req, res) => {
  try {
    const alertId = req.params.id;
    await db
      .update(alerts)
      .set({
        status: 'RESOLVED',
        resolvedAt: Date.now()
      })
      .where(eq(alerts.id, alertId));
    res.json({ success: true, message: 'Alert resolved successfully' });
  } catch (err) {
    console.error('Failed to resolve alert:', err);
    res.status(500).json({ error: 'Failed to resolve alert' });
  }
});

alertsRouter.delete('/:id', async (req, res) => {
  try {
    const alertId = req.params.id;
    await db.delete(alerts).where(eq(alerts.id, alertId));
    res.json({ success: true, message: 'Alert deleted successfully' });
  } catch (err) {
    console.error('Failed to delete alert:', err);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});
