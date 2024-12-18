import fs from 'fs/promises';
import path from 'path';

const pluginInfo = JSON.parse(await fs.readFile('src/plugin.info'));
const [_, __, author, name] = pluginInfo.title.split('/');
const pluginTitle = `${author}/${name}`;

// fix ReferenceError: process is not defined
const fixProcessUndefined = (code) => code.replace('process.env.NODE_ENV', '"development"');

const version = '19';
const reactPath = `node_modules/react/cjs`;
const reactDomPath = `node_modules/react-dom/cjs`;
const schedulerPath = `node_modules/.pnpm/scheduler@0.25.0/node_modules/scheduler/cjs`;

const [reactDev, react, reactDomDev, reactDom, reactDomClientDev, reactClientDom, reactJsxRuntimeDev, reactJsxRuntime, schedulerDev, scheduler] = await Promise.all([
  fs.readFile(path.join(reactPath, `react.development.js`), 'utf-8').then(fixProcessUndefined),
  fs.readFile(path.join(reactPath, `react.production.js`), 'utf-8'),
  fs.readFile(path.join(reactDomPath, `react-dom.development.js`), 'utf-8').then(fixProcessUndefined),
  fs.readFile(path.join(reactDomPath, `react-dom.production.js`), 'utf-8'),
  fs.readFile(path.join(reactDomPath, `react-dom-client.development.js`), 'utf-8').then(fixProcessUndefined),
  fs.readFile(path.join(reactDomPath, `react-dom-client.production.js`), 'utf-8'),
  fs.readFile(path.join(reactPath, `react-jsx-runtime.development.js`), 'utf-8').then(fixProcessUndefined),
  fs.readFile(path.join(reactPath, `react-jsx-runtime.production.js`), 'utf-8'),
  fs.readFile(path.join(schedulerPath, `scheduler.development.js`), 'utf-8').then(fixProcessUndefined),
  fs.readFile(path.join(schedulerPath, `scheduler.production.js`), 'utf-8'),
]);

const distDir = path.join(__dirname, '..', 'dist');
const devPluginPath = path.join(distDir, 'plugins', author, `${name}-dev`);
const pluginPath = path.join(distDir, 'plugins', author, name);
await Promise.all([
  fs.writeFile(path.join(devPluginPath, 'react.js'), reactDev),
  fs.writeFile(path.join(pluginPath, 'react.js'), react),
  fs.writeFile(path.join(devPluginPath, 'react-dom.js'), reactDomDev),
  fs.writeFile(path.join(pluginPath, 'react-dom.js'), reactDom),
  fs.writeFile(path.join(devPluginPath, 'react-dom-client.js'), reactDomClientDev),
  fs.writeFile(path.join(pluginPath, 'react-dom-client.js'), reactClientDom),
  fs.writeFile(path.join(devPluginPath, 'react-jsx-runtime.js'), reactJsxRuntimeDev),
  fs.writeFile(path.join(pluginPath, 'react-jsx-runtime.js'), reactJsxRuntime),
  fs.writeFile(path.join(devPluginPath, 'scheduler.js'), schedulerDev),
  fs.writeFile(path.join(pluginPath, 'scheduler.js'), scheduler),
]);
