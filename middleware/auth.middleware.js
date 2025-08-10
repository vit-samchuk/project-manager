const crypto = require('crypto');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (token !== process.env.API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
function authMiddlewareGitHub(req, res, next) {
  const secret = process.env.API_TOKEN;
  const signature = req.headers['x-hub-signature-256'];

  console.log({ secret, signature, rawBody: req.rawBody })

  if (!signature) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(JSON.stringify(req.rawBody)).digest('hex');
  const verified = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  console.log({ verified })
  if (!verified) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

module.exports = authMiddlewareGitHub;