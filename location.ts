import { Router } from 'express';
import { searchLocations } from '../services/location';

export const locationRouter = Router();

locationRouter.get('/search', async (req, res) => {
  try {
    const q = req.query.q ? String(req.query.q) : '';
    if (!q || q.trim().length < 2) {
      res.json([]);
      return;
    }

    const results = await searchLocations(q);
    res.json(results);
  } catch (err: any) {
    console.error('Location route search error:', err);
    res.status(500).json({ error: 'Location search is temporarily unavailable.' });
  }
});
