const repoDir = path.join(__dirname, '..');
const distDir = path.join(repoDir, 'dist', 'plugins', 'linonetwo', 'react-lib');
const distDevDir = path.join(repoDir, 'dist', 'plugins', 'linonetwo', 'react-lib-dev');
// cross platform cp -r ${repoDir}/src/ ${distDir}/
await Promise.all([
  fs.copy(path.join(repoDir, 'src'), distDir),
  fs.copy(path.join(repoDir, 'src'), distDevDir),
  fs.copy(path.join(repoDir, 'react-lib'), distDir),
  fs.copy(path.join(repoDir, 'react-lib-dev'), distDevDir),
]);
