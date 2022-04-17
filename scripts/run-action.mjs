/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * Run github action that packs JSON plugin
 */
import { RunOptions, RunTarget } from 'github-action-ts-run-api';
import { fs } from 'zx';

const pluginInfo = fs.readJsonSync('src/plugin.info');
const [_, __, author, name] = pluginInfo.title.split('/');
const pluginTitle = `${author}/${name}`;

// RunTarget.preJsScript() and RunTarget.postJsScript() are also available
const target = RunTarget.mainJs(path.resolve('node_modules/tw5-plugin-packer/action.yml'));
const options = RunOptions.create()
  .setInputs({
    minify: process.env.CI === undefined ? false : true,
    source: [`dist/plugins/${pluginTitle}`],
    output: 'dist/out',
    'uglifyjs-options': '{ "warnings": false, "ie8": false, "safari10": false }',
    'cleancss-options': '{ "compatibility": "*", "level": 2 }',
  })
  // Internally, runner will fake a json file to be picked by @actions/github
  .setGithubContext({ payload: { push: { tags: ['v0.1.1'] } } })
  // By default, RUNNER_TEMP is faked for a run and then deleted. Keep it
  .setFakeFsOptions({ rmFakedTempDirAfterRun: false });

await target.run(options);
await target.run(options.setInputs({ source: [`dist/plugins/${pluginTitle}-dev`], output: 'dist/out-dev' }));

const distDir = path.join(__dirname, '..', 'dist');
await fs.rename(path.join(distDir, 'out-dev', '$__plugins_linonetwo_tw-react.json'), path.join(distDir, 'out', '$__plugins_linonetwo_tw-react-dev.json'));
await fs.remove(path.join(distDir, 'out-dev'));
