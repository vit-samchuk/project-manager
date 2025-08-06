const simpleGit = require('simple-git');
const path = require('path');

const git = simpleGit();

git.addConfig('user.name', process.env.GIT_USER_NAME);
git.addConfig('user.email', process.env.GIT_USER_EMAIL);

async function commitAndPush(message) {
  await git.add('./readme.md');
  await git.commit(message);
  await git.push('origin', process.env.GIT_BRANCH);
}

module.exports = { commitAndPush };
