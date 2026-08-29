import { Router } from 'express';
import { testFortyGuardConnection, clearFortyGuardCache, getSiteTemperature, getFortyGuardCacheInfo } from '../services/fortyguard';

export const fortyguardRouter = Router();

fortyguardRouter.get('/temperature', async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const forceRefresh = req.query.refresh === 'true';

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Valid lat and lng query parameters are required' });
    }

    const result = await getSiteTemperature(lat, lng, forceRefresh);
    res.json(result);
  } catch (err: any) {
    console.error('Error fetching site temperature from FortyGuard:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch FortyGuard temperature' });
  }
});

fortyguardRouter.get('/cache-info', (req, res) => {
  res.json(getFortyGuardCacheInfo());
});

fortyguardRouter.get('/test-connection', async (req, res) => {
  try {
    const latParam = req.query.lat ? Number(req.query.lat) : 33.4484; // Default to Phoenix, AZ
    const lngParam = req.query.lng ? Number(req.query.lng) : -112.0740;
    const locationName = req.query.location ? String(req.query.location) : 'Phoenix, AZ';

    const result = await testFortyGuardConnection(latParam, lngParam, locationName);
    res.json(result);
  } catch (err: any) {
    console.error('FortyGuard diagnostic test error:', err);
    res.status(500).json({
      state: 3,
      stateLabel: 'API Request Failed',
      apiKeyConfigured: !!process.env.FORTYGUARD_API_KEY,
      requestSent: false,
      httpStatus: 500,
      activityId: null,
      responseReceived: false,
      dataAvailable: false,
      details: err.message || 'Error running FortyGuard diagnostic test',
      stats: null,
      timestamp: new Date().toISOString(),
      testLocation: 'Phoenix, AZ',
      coordinates: { lat: 33.4484, lng: -112.0740 }
    });
  }
});

fortyguardRouter.post('/clear-cache', (req, res) => {
  clearFortyGuardCache();
  res.json({ success: true, message: 'FortyGuard cache cleared' });
});
