/**
 * Run github action that packs JSON plugin
 */
import { RunOptions, RunTarget } from 'github-action-ts-run-api';

// RunTarget.preJsScript() and RunTarget.postJsScript() are also available
const target = RunTarget.mainJs(path.resolve('node_modules/tw5-plugin-packer/action.yml'));
const options = RunOptions.create()
  .setInputs({
    minify: true,
    source: ['dist/plugins/linonetwo/tw-react'],
    output: 'dist/out',
    'uglifyjs-options': { warnings: false, ie8: false, safari10: false },
    'cleancss-options': { compatibility: '*', level: 2 },
  })
  // Internally, runner will fake a json file to be picked by @actions/github
  .setGithubContext({ payload: { push: { tags: ['v0.1.1'] } } })
  // By default, RUNNER_TEMP is faked for a run and then deleted. Keep it
  .setFakeFsOptions({ rmFakedTempDirAfterRun: false });

const res = await target.run(options);
