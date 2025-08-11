const simpleGit = require('simple-git');
const fs = require('fs/promises');

const git = simpleGit();
git.addConfig('user.name', process.env.GIT_USER_NAME);
git.addConfig('user.email', process.env.GIT_USER_EMAIL);

async function clone(url, b, p) {
  const git = simpleGit();
  await git.clone(url, p, ['-b', b, '--single-branch']);
}

async function pull(p) {
  if (!(await fs.access(p).then(() => true).catch(() => false))) {
    const err = new Error('No dir for branch!');
    err.status = 400;
    throw err;
  }
  
  const git = simpleGit(p);
  await git.pull();
}

async function commitAndPush(message) {
  await git.add('./readme.md');
  await git.commit(message);
  await git.push('origin', process.env.GIT_MAIN_BRANCH);
}

module.exports = {
  commitAndPush,
  clone,
  pull
};