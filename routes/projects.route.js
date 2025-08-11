const express = require('express');
const auth = require('../middleware/auth.middleware')
const { addProject, removeProject, updateProject } = require('../services/projects.service');

const router = express.Router();

router.post('/gh-hook', auth, async (req, res) => {
  const event = req.headers['x-github-event'];
  const branch = req.body.ref?.replace('refs/heads/', '') || req.body.ref;
  const clone_url = req.body.repository.clone_url;

  let result = null;
  
  console.log({ branch, clone_url })

  if (event === 'create' && req.body.ref_type === 'branch') {
    result = await addProject({ branch, clone_url });
  } 
  else if (event === 'delete' && req.body.ref_type === 'branch') {
    result = await removeProject(branch);
  } 
  else if (event === 'push' && branch !== process.env.GIT_MAIN_BRANCH) {
    result = await updateProject(branch);
  }

  res.json({ success: true, branch, result });
});


// router.post('/', auth, async (req, res) => {
//   console.log(req.body)
//   return
//   const { name, url, description } = req.body;
//   if (!name || !url) return res.status(400).send({ error: 'Missing name or url' });

//   await addProject({ name, url, description });
//   res.send({ success: true });
// });

// router.delete('/:branch', auth, async (req, res) => {
//   const { name } = req.params.branch;
//   console.log(name)
//   return;
//   if (!name) return res.status(400).send({ error: 'Missing name' });

//   await removeProject(name);
//   res.send({ success: true });
// });

module.exports = router;
