const fs = require('fs/promises');
const path = require('path');
const { generateReadme } = require('./readme.service');
const git = require('./git.service');

const BASE_PATH = process.env.PROJECTS_PATH

const dataPath = path.join(__dirname, '../data/projects.json');

const loadProjects = async () => JSON.parse(await fs.readFile(dataPath, 'utf-8'));

const sanitizeBranch = (b) => b.replace(/[\/\\:*?"<>| ]/g, '_');

const getPath = async (branch) => {
  let dirName = sanitizeBranch(branch);
  let finalName = dirName;
  let counter = 2;

  while (true) {
    try {
      await fs.access(path.join(BASE_PATH, finalName));
      finalName = `${dirName}_v${counter}`;
      counter++;
    } catch {
      break;
    }
  }

  return {
    dir: finalName,
    path: path.join(BASE_PATH, finalName)
  };
}

const getPackageInfo = async (projectPath) => {
  const pkgPath = path.join(projectPath, 'package.json');
  const exists = await fs.exists(pkgPath);
  
  if (!exists) return null;
  
  try {
    const content = await fs.readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(content);
    return {
      name: pkg.name || null,
      description: pkg.description || null
    };
  } catch {
    return null;
  }
}

const addProject = async ({ branch, clone_url }) => {
  const branchPath = getPath(branch)
  console.log(branchPath)
  await git.clone(clone_url, branch, branchPath.path)
  console.log('CLONED')
  const info = await getPackageInfo(projectPat.path);
  
  const project = {
    branch,
    dir: branchPath.dir,
    path: branchPath.path,
    name: info?.name ?? null,
    description: info?.description ?? null
  }
  
  const projects = await loadProjects();
  
  projects.push(project);
  await fs.writeFile(dataPath, JSON.stringify(projects, null, 2));
  await generateReadme(projects);
  
  return project;
}

const removeProject = async (branch) => {
  const projects = await loadProjects();
  const project = project.find((p) => p.branch === branch)
  
  if (!project) return null;
  
  const exists = await fs.exists(project.path)
  
  if (exists) {
    await fs.rm(project.path, { recursive: true, force: true });
  }
  
  const filtered = projects.filter(p => p.branch !== branch);
  await fs.writeFile(dataPath, JSON.stringify(filtered, null, 2));
  await generateReadme(filtered);
  
  return project;
}

const updateProject = async (branch) => {
  // git pull branch
  // fs get data from package
  // update data and readme if changed
  // git push readme update
  if (branch === 'main') return null;
  
  const projects = await loadProjects();
  const project = projects.find((p) => p.branch === branch)
  
  await git.pull(project.path);
  
  const info = await getPackageInfo(projectPath);
  
  if (project.name !== (info?.name ?? null) || project.description !== (info?.description ?? null)) {
    project.name = info.name ?? null;
    project.description = info.description ?? null;
    await fs.writeFile(dataPath, JSON.stringify(projects, null, 2));
    await generateReadme(projects);
  }
  return project;
}

module.exports = { addProject, removeProject, updateProject };