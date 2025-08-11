const simpleGit = require('simple-git');
const fs = require('fs/promises');

const git = simpleGit();
git.addConfig('user.name', process.env.GIT_USER_NAME);
git.addConfig('user.email', process.env.GIT_USER_EMAIL);

async function clone(cloneUrl, branch, targetPath) {
  console.log({
    cloneUrl,
    branch,
    targetPath
  })
  const gitInstance = simpleGit();
  
  await gitInstance.clone(cloneUrl, targetPath, ['-b', branch, '--single-branch']);
}

async function pull(targetPath) {
  if (!(await fs.access(targetPath).then(() => true).catch(() => false))) {
    const err = new Error('No dir for branch!');
    err.status = 400;
    throw err;
  }
  
  
  const gitInstance = simpleGit(targetPath);
  await gitInstance.pull();
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