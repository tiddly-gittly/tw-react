const pluginInfo = fs.readJsonSync('src/plugin.info');
const [_, __, author, name] = pluginInfo.title.split('/');
const pluginTitle = `${author}/${name}`;

const version = '18';
const [reactDev, reactDomDev, react, reactDom] = await Promise.all([
  fetch(`https://unpkg.com/react@${version}/umd/react.development.js`).then((r) => r.text()),
  fetch(`https://unpkg.com/react-dom@${version}/umd/react-dom.development.js`).then((r) => r.text()),
  fetch(`https://unpkg.com/react@${version}/umd/react.production.min.js`).then((r) => r.text()),
  fetch(`https://unpkg.com/react-dom@${version}/umd/react-dom.production.min.js`).then((r) => r.text()),
]);

const distDir = path.join(__dirname, '..', 'dist');
const devPluginPath = path.join(distDir, 'plugins', author, `${name}-dev`);
const pluginPath = path.join(distDir, 'plugins', author, name);
await Promise.all([
  fs.writeFile(path.join(devPluginPath, 'react.js'), reactDev),
  fs.writeFile(path.join(devPluginPath, 'react-dom.js'), reactDomDev),
  fs.writeFile(path.join(pluginPath, 'react.js'), react),
  fs.writeFile(path.join(pluginPath, 'react-dom.js'), reactDom),
]);
