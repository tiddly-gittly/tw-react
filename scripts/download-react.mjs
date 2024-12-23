import fs from 'fs/promises';
import path from 'path';

const pluginInfo = JSON.parse(await fs.readFile('src/plugin.info'));
const [_, __, author, name] = pluginInfo.title.split('/');
const pluginTitle = `${author}/${name}`;

// fix ReferenceError: process is not defined
const fixProcessUndefined = (code) => code.replace('process.env.NODE_ENV', '"development"');
// prevent collision of name, use a different name. See `src/react-scheduler.js.meta`.
const fixSchedulerNameCollision = (code) => code.replace('require("scheduler")', 'require("react-scheduler.js")');

const version = '19';
const reactPath = `node_modules/react/cjs`;
const reactDomPath = `node_modules/react-dom/cjs`;
const schedulerPath = `node_modules/.pnpm/scheduler@0.25.0/node_modules/scheduler/cjs`;

const [
  reactDevelopment,
  react,
  reactDomDevelopment,
  reactDom,
  reactDomClientDevelopment,
  reactClientDom,
  reactJsxRuntimeDevelopment,
  reactJsxRuntime,
  schedulerDevelopment,
  scheduler,
] = await Promise.all([
  fs.readFile(path.join(reactPath, `react.development.js`), 'utf8').then(fixProcessUndefined),
  fs.readFile(path.join(reactPath, `react.production.js`), 'utf8'),
  fs.readFile(path.join(reactDomPath, `react-dom.development.js`), 'utf8').then(fixProcessUndefined),
  fs.readFile(path.join(reactDomPath, `react-dom.production.js`), 'utf8'),
  fs.readFile(path.join(reactDomPath, `react-dom-client.development.js`), 'utf8').then(fixProcessUndefined).then(fixSchedulerNameCollision),
  fs.readFile(path.join(reactDomPath, `react-dom-client.production.js`), 'utf8').then(fixSchedulerNameCollision),
  fs.readFile(path.join(reactPath, `react-jsx-runtime.development.js`), 'utf8').then(fixProcessUndefined),
  fs.readFile(path.join(reactPath, `react-jsx-runtime.production.js`), 'utf8'),
  fs.readFile(path.join(schedulerPath, `scheduler.development.js`), 'utf8').then(fixProcessUndefined),
  fs.readFile(path.join(schedulerPath, `scheduler.production.js`), 'utf8'),
]);

const distDir = path.join(__dirname, '..', 'dist');
const developmentPluginPath = path.join(distDir, 'plugins', author, `${name}-dev`);
const pluginPath = path.join(distDir, 'plugins', author, name);
await Promise.all([
  fs.writeFile(path.join(developmentPluginPath, 'react.js'), reactDevelopment),
  fs.writeFile(path.join(pluginPath, 'react.js'), react),
  fs.writeFile(path.join(developmentPluginPath, 'react-dom.js'), reactDomDevelopment),
  fs.writeFile(path.join(pluginPath, 'react-dom.js'), reactDom),
  fs.writeFile(path.join(developmentPluginPath, 'react-dom-client.js'), reactDomClientDevelopment),
  fs.writeFile(path.join(pluginPath, 'react-dom-client.js'), reactClientDom),
  fs.writeFile(path.join(developmentPluginPath, 'react-jsx-runtime.js'), reactJsxRuntimeDevelopment),
  fs.writeFile(path.join(pluginPath, 'react-jsx-runtime.js'), reactJsxRuntime),
  fs.writeFile(path.join(developmentPluginPath, 'react-scheduler.js'), schedulerDevelopment),
  fs.writeFile(path.join(pluginPath, 'react-scheduler.js'), scheduler),
]);
