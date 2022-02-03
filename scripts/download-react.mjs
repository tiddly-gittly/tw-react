const { fs } = require('zx');

const version = '17';
const [reactDev, reactDomDev, react, reactDom] = await Promise.all([
  fetch(`https://unpkg.com/react@${version}/umd/react.development.js`).then((r) => r.text()),
  fetch(`https://unpkg.com/react-dom@${version}/umd/react-dom.development.js`).then((r) => r.text()),
  fetch(`https://unpkg.com/react@${version}/umd/react.production.min.js`).then((r) => r.text()),
  fetch(`https://unpkg.com/react-dom@${version}/umd/react-dom.production.min.js`).then((r) => r.text()),
]);

const devPluginPath = 'dist/plugins/linonetwo/react-lib-dev';
const pluginPath = 'dist/plugins/linonetwo/react-lib';
await Promise.all([fs.mkdirp(devPluginPath), fs.mkdirp(pluginPath)]);
await Promise.all([
  fs.writeFile(path.join(devPluginPath, 'react.js'), reactDev),
  fs.writeFile(path.join(devPluginPath, 'react-dom.js'), reactDomDev),
  fs.writeFile(path.join(pluginPath, 'react.js'), react),
  fs.writeFile(path.join(pluginPath, 'react-dom.js'), reactDom),
]);
