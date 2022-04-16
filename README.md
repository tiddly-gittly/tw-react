# TiddlyWiki React

[What’s your opinion about using ReactJS in the plugin?](https://talk.tiddlywiki.org/t/whats-your-opinion-about-using-reactjs-in-the-plugin/2191) Sometimes it is inevitable to use ReactJS in the widget, for example, JSONSchemaForm.

## Trouble shotting

### React is undefined

You may need `import React from 'react';` on the top of jsx file, even you are in react 17+ and not using this variable...
