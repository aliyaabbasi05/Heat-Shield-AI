import { Router } from 'express';
import { processAgentRequest, analyzeAllSites } from '../services/agent';

export const agentRouter = Router();

agentRouter.post('/chat', async (req, res) => {
  try {
    if (!req.body.message || typeof req.body.message !== 'string') {
      return res.status(400).json({ error: 'A valid prompt message is required.' });
    }

    const result = await processAgentRequest(req.body.message);
    res.json(result);
  } catch (err: any) {
    console.error('Agent chat error:', err);
    res.json({
      text: 'An error occurred while processing your request. Please try again.',
      actionLog: ['Request processing failed']
    });
  }
});

// A direct endpoint for the dashboard to get the analysis without chat
agentRouter.get('/analysis', async (req, res) => {
  try {
    const forceRefresh = req.query.refresh === 'true';
    const result = await analyzeAllSites(forceRefresh);
    res.json(result);
  } catch (err: any) {
    console.error('Analysis error:', err);
    res.status(500).json({ error: err.message || 'Failed to generate analysis' });
  }
});
