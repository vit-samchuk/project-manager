const crypto = require('crypto');

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (token !== process.env.API_TOKEN) return _401(res);
  next();
}
function authMiddlewareGitHub(req, res, next) {
  const secret = process.env.API_TOKEN;
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) return _401(res);
  
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(req.rawBody).digest('hex');
  const verified = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
  if (!verified) return _401(res);
  
  next();
}

const _401 = (res) => res.status(401).json({ error: 'Unauthorized' });

module.exports = authMiddlewareGitHub;