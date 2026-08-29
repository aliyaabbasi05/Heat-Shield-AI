import { Router } from 'express';
import { db } from '../../db/index';
import { sites } from '../../db/schema';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

export const sitesRouter = Router();

sitesRouter.get('/', async (req, res) => {
  try {
    const allSites = await db.select().from(sites);
    res.json(allSites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sites' });
  }
});

sitesRouter.post('/', async (req, res) => {
  try {
    const { name, city, state, lat, lng, siteType, operatingHours, notes } = req.body;
    
    if (!name || !city || !state || lat === undefined || lng === undefined || lat === '' || lng === '') {
      return res.status(400).json({ error: 'Missing required fields: name, city, state, lat, lng' });
    }

    const parsedLat = Number(lat);
    const parsedLng = Number(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng) || parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
      return res.status(400).json({ error: 'Invalid latitude or longitude coordinates' });
    }

    const id = crypto.randomUUID();
    const newSite = {
      id,
      name: String(name).trim(),
      city: String(city).trim(),
      state: String(state).trim(),
      lat: parsedLat,
      lng: parsedLng,
      siteType: siteType ? String(siteType).trim() : 'Construction',
      operatingHours: operatingHours ? String(operatingHours).trim() : null,
      notes: notes ? String(notes).trim() : null,
      createdAt: Date.now(),
    };

    await db.insert(sites).values(newSite);
    console.log(`Successfully added site ${newSite.name} (${newSite.id}) to database`);
    res.json(newSite);
  } catch (err: any) {
    console.error('Failed to create site:', err);
    res.status(500).json({ error: err.message || 'Failed to create site' });
  }
});

sitesRouter.delete('/:id', async (req, res) => {
  try {
    const siteId = req.params.id;
    if (!siteId) {
      return res.status(400).json({ error: 'Missing site ID parameter' });
    }

    await db.delete(sites).where(eq(sites.id, siteId));
    console.log(`Successfully deleted site ${siteId} from persistent database`);
    res.json({ success: true, deletedId: siteId });
  } catch (err: any) {
    console.error(`Failed to delete site ${req.params.id}:`, err);
    res.status(500).json({ error: err.message || 'Failed to delete site from database' });
  }
});
