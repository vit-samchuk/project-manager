const fs = require('fs/promises');
const path = require('path');
const { marked } = require('marked');
const { commitAndPush } = require('./git.service');

const templatePath = path.join(__dirname, '../readme.template.md');
const readmePath = path.join(__dirname, '../readme.md');
const dataPath = path.join(__dirname, '../projects.json');

const formatProject = (p) => {
  const title = p.name || p.branch;
  const url = `https://${p.dir}.projects.do-code.com`;

  let lines = [];

  lines.push(`- [${title}](${url})`);

  if (p.branch_url) {
    lines.push(`  - Branch: [${p.branch}](${p.branch_url})`);
  } else {
    lines.push(`  - Branch: ${p.branch}`);
  }

  if (p.description) {
    lines.push(`  - ${p.description}`);
  }

  return lines.join('\n');
};


const getReadmeHtml = async () => {
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

const generateReadme = async (projects, msg) => {
  console.log(projects)
  const template = await fs.readFile(templatePath, 'utf-8');
  const projectList = projects.map(formatProject).join('\n\n');
  
  const rendered = template.replace('{{projects}}', projectList);
  await fs.writeFile(readmePath, rendered);
  await commitAndPush(msg)
}

module.exports = { generateReadme, getReadmeHtml };
