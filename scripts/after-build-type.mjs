/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { fs, path } from 'zx';

const repoDir = path.join(__dirname, '..');
const distDir = path.join(__dirname, '..', 'dist');
const distLibDir = path.join(distDir, 'lib');

const pluginCopyOptions = {
  filter: (source, destination) => {
    // allow folder (otherwise it will stop at first step) and .d.ts files
    if (path.extname(source) === '' || source.endsWith('.d.ts')) {
      // Return true to copy the item
      return true;
    }
  },
};
await fs.copy(path.join(repoDir, 'src'), distLibDir, pluginCopyOptions);

// manually add this, otherwise it will be changed by tsc to `/// <reference types="src/type" />` which is totally wrong.
const distributionIndexFilePath = path.join(distLibDir, './index.d.ts');
const stringToPrepend = '/// <reference types="type.d.ts" />';
const data = await fs.readFile(distributionIndexFilePath, 'utf8');
const newData = `${stringToPrepend}\n${data}`;
await fs.writeFile(distributionIndexFilePath, newData);
