import { Router, Request, Response } from 'express';

const router = Router();
const GEOSTUDIO_API_BASE = 'https://geostudio-api-production.up.railway.app';

async function proxyRequest(
  req: Request,
  res: Response,
  targetPath: string,
  method: 'GET' | 'POST'
) {
  const url = `${GEOSTUDIO_API_BASE}${targetPath}`;
  console.log(`[GeoCamProxy] ${method} ${targetPath}`);

  try {
    const headers: Record<string, string> = {};
    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type'] as string;
    }
    if (req.headers['authorization']) {
      headers['Authorization'] = req.headers['authorization'] as string;
    }

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (method === 'POST' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, fetchOptions);
    const data = await response.text();

    console.log(`[GeoCamProxy] Response: ${response.status}`);

    res.status(response.status);

    const contentType = response.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    res.send(data);
  } catch (error) {
    console.error(`[GeoCamProxy] Error:`, error);
    res.status(502).json({ error: 'Bad Gateway', message: 'Failed to reach GeoStudio API' });
  }
}

// POST /api/geocam/scan/start
router.post('/scan/start', (req, res) => {
  proxyRequest(req, res, '/api/geocam/scan/start', 'POST');
});

// POST /api/geocam/verify
router.post('/verify', (req, res) => {
  proxyRequest(req, res, '/api/geocam/verify', 'POST');
});

// POST /api/geocam/register
router.post('/register', (req, res) => {
  proxyRequest(req, res, '/api/geocam/register', 'POST');
});

// GET /api/geocam/status/:dinaId
router.get('/status/:dinaId', (req, res) => {
  proxyRequest(req, res, `/api/geocam/status/${req.params.dinaId}`, 'GET');
});

// GET /api/geocam/trust-stats/:dinaId
router.get('/trust-stats/:dinaId', (req, res) => {
  proxyRequest(req, res, `/api/geocam/trust-stats/${req.params.dinaId}`, 'GET');
});

export default router;
