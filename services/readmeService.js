const fs = require('fs/promises');
const path = require('path');
const { marked } = require('marked');

const { commitAndPush } = require('./gitService');

const readmePath = path.join(__dirname, '../readme.md');

async function getReadme() {
  return await fs.readFile(readmePath, 'utf-8');
}

async function getReadmeHtml(param) {
  const readme = await getReadme();
  const html = marked.parse(readme);
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>README</title>
        <style>
          body {
            font-family: sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 0 20px;
            line-height: 1.6;
          }
          code { background: #f0f0f0; padding: 2px 4px; }
          pre { background: #f0f0f0; padding: 10px; overflow-x: auto; }
        </style>
      </head>
      <body>${html}</body>
    </html>
  `;
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

module.exports = { addProject, removeProject, getReadmeHtml };
