export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey =
    process.env.VITE_NVIDIA_API_KEY ||
    process.env.NVIDIA_API_KEY ||
    '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';

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('NVIDIA proxy error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
