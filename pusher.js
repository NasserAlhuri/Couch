// api/pusher.js — Vercel Serverless Function
// Receives events from host/players and forwards them to Pusher
// Set these environment variables in Vercel dashboard:
//   PUSHER_APP_ID, PUSHER_KEY, PUSHER_SECRET, PUSHER_CLUSTER

const crypto = require('crypto');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { channel, event, data } = req.body;

  if (!channel || !event || !data) {
    return res.status(400).json({ error: 'Missing channel, event, or data' });
  }

  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.PUSHER_CLUSTER;

  if (!appId || !key || !secret || !cluster) {
    return res.status(500).json({ error: 'Pusher env vars not configured' });
  }

  const body = JSON.stringify({
    name: event,
    channel,
    data: JSON.stringify(data),
  });

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const md5Body = crypto.createHash('md5').update(body).digest('hex');
  const path = `/apps/${appId}/events`;

  const toSign = [
    'POST',
    path,
    `auth_key=${key}&auth_timestamp=${timestamp}&auth_version=1.0&body_md5=${md5Body}`,
  ].join('\n');

  const signature = crypto
    .createHmac('sha256', secret)
    .update(toSign)
    .digest('hex');

  const url = `https://api-${cluster}.pusher.com${path}?auth_key=${key}&auth_timestamp=${timestamp}&auth_version=1.0&body_md5=${md5Body}&auth_signature=${signature}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(500).json({ error: 'Pusher error', detail: text });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
