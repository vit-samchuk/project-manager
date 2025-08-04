const express = require('express');
const { addProject, removeProject } = require('../services/readmeService');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, url } = req.body;
  if (!name || !url) return res.status(400).send({ error: 'Missing name or url' });

  await addProject(name, url);
  res.send({ success: true });
});

router.delete('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send({ error: 'Missing name' });

  await removeProject(name);
  res.send({ success: true });
});

module.exports = router;
