const fs = require('fs/promises');
const path = require('path');
const { generateReadme } = require('./readme.service');

const dataPath = path.join(__dirname, '../data/projects.json');

const loadProjects = async () => JSON.parse(await fs.readFile(dataPath, 'utf-8'));

const addProject = async (project) => {
  const projects = await loadProjects();

  if (projects.some(p => p.name === project.name)) return;

  projects.push(project);
  await fs.writeFile(dataPath, JSON.stringify(projects, null, 2));
  await generateReadme(projects);
}

const removeProject = async (name) => {
  const projects = await loadProjects();

  const filtered = projects.filter(p => p.name !== name);
  await fs.writeFile(dataPath, JSON.stringify(filtered, null, 2));
  await generateReadme(projects);
}

module.exports = { addProject, removeProject };
