const fs = require('fs/promises');
const path = require('path');
const { commitAndPush } = require('./gitService');

const readmePath = path.join(__dirname, '../readme.md');

async function getReadme() {
  return await fs.readFile(readmePath, 'utf-8');
}

function formatLine(name, url) {
  return `- [${name}](${url})`;
}

async function addProject(name, url) {
  const readme = await getReadme();
  const projectLine = formatLine(name, url);
  if (readme.includes(projectLine)) return;

  const updated = readme.replace(
    /## Projects([\s\S]*?)$/,
    (match, p1) => `## Projects${p1}\n${projectLine}`
  );
  await fs.writeFile(readmePath, updated);
  //await commitAndPush('Add project: ' + name);
}

async function removeProject(name) {
  const readme = await getReadme();
  const updated = readme.replace(
    new RegExp(`- \\[${name}\\]\\(.*?\\)\n?`, 'g'),
    ''
  );
  await fs.writeFile(readmePath, updated);
  //await commitAndPush('Remove project: ' + name);
}

module.exports = { addProject, removeProject };
