const express = require('express');
const auth = require('../middleware/auth.middleware')
const { addProject, removeProject } = require('../services/projects.service');

const router = express.Router();

router.post('/gh-hook', auth, async (req, res) => {
  const event = req.headers['x-github-event'];
  let branch = null;

  if (event === 'push') {
    branch = req.body.ref.replace('refs/heads/', '');
  } else if (event === 'create' || event === 'delete') {
    if (req.body.ref_type === 'branch') {
      branch = req.body.ref;
    }
  }

  console.log({ event, branch });

  if (event === 'push') {
    handlePush(branch, req.body);
  } else if (event === 'create') {
    handleBranchCreate(branch);
  } else if (event === 'delete') {
    handleBranchDelete(branch);
  }

  res.send({ success: true });
});

function handlePush() {}
function handleBranchCreate() {}
function handleBranchDelete() {}

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
