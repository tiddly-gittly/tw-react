/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const esbuild = require('esbuild');
const { readJsonSync } = require('fs-extra');
const browserslist = require('browserslist');
const { esbuildPluginBrowserslist, resolveToEsbuildTarget } = require('esbuild-plugin-browserslist');
const fs = require('fs-extra');

const pluginInfo = readJsonSync('src/plugin.info');
const [_, __, author, name] = pluginInfo.title.split('/');
const pluginTitle = `${author}/${name}`;
const packageJSON = readJsonSync('package.json');

const distDir = path.join(__dirname, 'dist');
const devPluginPath = path.join(distDir, 'plugins', author, `${name}-dev`);
const pluginPath = path.join(distDir, 'plugins', author, name);
await Promise.all([fs.mkdirp(devPluginPath), fs.mkdirp(pluginPath)]);

const result = await esbuild.build({
  write: false,
  entryPoints: packageJSON.tsFiles.map((tsFileName) => `./src/${tsFileName}.ts`),
  bundle: true,
  // let tiddly-gittly/tw5-plugin-packer minify it, and let our fix of `module exports` works
  minify: false,
  outdir: `./dist/plugins/${author}/${name}`,
  sourcemap: process.env.CI ? false : 'inline',
  format: 'cjs',
  platform: 'browser',
  external: ['$:/*', 'react', 'react-dom'],
  plugins: [
    esbuildPluginBrowserslist(browserslist('last 2 versions'), {
      printUnknownTargets: false,
    }),
  ],
});

for (let out of result.outputFiles) {
  let content = new TextDecoder().decode(out.contents);
  if (out.path.endsWith('plugins/linonetwo/tw-react/index.js')) {
    // skip
  } else {
    // fix esbuild `module.exports = ` causing library not recognizable
    content = content.replace('module.exports = ', '');
  }
  await fs.writeFile(out.path, content, 'utf8');
}
