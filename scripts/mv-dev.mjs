const pluginInfo = fs.readJsonSync('src/plugin.info');
const [_, __, author, name] = pluginInfo.title.split('/');
const pluginTitle = `${author}_${name}`;

const distDir = path.join(__dirname, '..', 'dist');
await fs.rename(path.join(distDir, 'out-dev', `$__plugins_${pluginTitle}.json`), path.join(distDir, 'out', `$__plugins_${pluginTitle}-dev.json`));
await fs.remove(path.join(distDir, 'out-dev'));
