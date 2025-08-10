require('dotenv').config();
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const bodyParser = require('body-parser');

const projectRoutes = require('./routes/projects.route');
const { getReadmeHtml } = require('./services/readme.service');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

app.get('/', async (req, res) => {
  const html = await getReadmeHtml();
  res.type('html').send(html)
});

app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
