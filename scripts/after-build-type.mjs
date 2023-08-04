import { fs, path } from 'zx';

const repoDir = path.join(__dirname, '..');
const distDir = path.join(__dirname, '..', 'dist');
const distLibDir = path.join(distDir, 'lib');

const pluginCopyOptions = {
  filter: (src, dest) => {
    // allow folder (otherwise it will stop at first step) and .d.ts files
    if (path.extname(src) === '' || src.endsWith('.d.ts')) {
      // Return true to copy the item
      return true;
    }
  },
};
await fs.copy(path.join(repoDir, 'src'), distLibDir, pluginCopyOptions);
