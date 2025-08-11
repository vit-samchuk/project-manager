const fs = require('fs/promises');
const path = require('path');
const { marked } = require('marked');
const { commitAndPush } = require('./git.service');

const templatePath = path.join(__dirname, '../readme.template.md');
const readmePath = path.join(__dirname, '../readme.md');
const dataPath = path.join(__dirname, '../projects.json');

const formatProject = ({ name, url, description }) => {
  const desc = description ? ` — ${description}` : '';
  return `- [${name}](${url})${desc}`;
}

const getReadmeHtml = async (param) => {
  const readme = await fs.readFile(readmePath, 'utf-8');
  const html = marked.parse(readme);
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Projects</title>
          <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
          <script>
            eruda.init();
        </script>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>${html}</body>
    </html>
  `;
}

const generateReadme = async (projects) => {
  console.log(projects)
  const template = await fs.readFile(templatePath, 'utf-8');
  const projectList = projects.map(formatProject).join('\n');
  
  const rendered = template.replace('{{projects}}', projectList);
  await fs.writeFile(readmePath, rendered);
  // todo commit and push
}

module.exports = { generateReadme, getReadmeHtml };
