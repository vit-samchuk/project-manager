const express = require('express');
const auth = require('../middleware/auth.middleware')
const { addProject, removeProject } = require('../services/projects.service');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  console.log(req.body)
  return
  const { name, url, description } = req.body;
  if (!name || !url) return res.status(400).send({ error: 'Missing name or url' });

  await addProject({ name, url, description });
  res.send({ success: true });
});

router.delete('/:branch', auth, async (req, res) => {
  const { name } = req.params.branch;
  console.log(name)
  return;
  if (!name) return res.status(400).send({ error: 'Missing name' });

  await removeProject(name);
  res.send({ success: true });
});

module.exports = router;
