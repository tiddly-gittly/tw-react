const repoDir = path.join(__dirname, '..');
const distDir = path.join(repoDir, 'dist', 'plugins', 'linonetwo', 'tw-react');
const distDevDir = path.join(repoDir, 'dist', 'plugins', 'linonetwo', 'tw-react-dev');
// cross platform cp -r ${repoDir}/src/ ${distDir}/
await Promise.all([fs.copy(path.join(repoDir, 'src'), distDir), fs.copy(path.join(repoDir, 'src'), distDevDir)]);
