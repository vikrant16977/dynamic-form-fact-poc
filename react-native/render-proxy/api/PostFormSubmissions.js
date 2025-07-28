export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://dynamicformbackend.onrender.com/odata/v4/catalog/FormSubmissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any other headers needed by the target API
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
}
