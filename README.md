# TiddlyWiki React

[What’s your opinion about using ReactJS in the plugin?](https://talk.tiddlywiki.org/t/whats-your-opinion-about-using-reactjs-in-the-plugin/2191) Sometimes it is inevitable to use ReactJS in the widget, for example, JSONSchemaForm.

See [Website for documentation](https://tiddly-gittly.github.io/tw-react/#%24%3A%2Fplugins%2Flinonetwo%2Ftw-react%2Freadme:%24%3A%2Fplugins%2Flinonetwo%2Ftw-react%2Freadme%20Index).

## Usage

Add this to a `type.d.ts` file to your `src/` folder:

```ts
declare module '$:/plugins/linonetwo/tw-react/widget.js' {
  import { IReactWidgetConstructor } from 'tw-react';
  const widget: IReactWidgetConstructor;
}
```

or in `tsconfig.json` add:

```json
    "typeRoots" : ["node_modules/@types", "node_modules/tw5-typed", "node_modules/tw-react/dist/lib"],
```

## Products

1. [WhiteBoard plugin](https://talk.tiddlywiki.org/t/whiteboard-plugin-v0-2-3/5302)
2. [Demo of a new WYSIWYG editor: slate-write (unstable alpha stage)](https://talk.tiddlywiki.org/t/demo-of-a-new-wysiwyg-editor-slate-write-unstable-alpha-stage/2788)
3. [FlowTiwi - a Multi-column draggable resizable sidebar (beta release)](https://talk.tiddlywiki.org/t/flowtiwi-a-multi-column-draggable-resizable-sidebar-beta-release/3128)
4. [Smart Form plugin - beta release - Display different form based on the tag you add](https://talk.tiddlywiki.org/t/smart-form-plugin-beta-release-display-different-form-based-on-the-tag-you-add/2417)

When installing these plugins from [TiddlyWiki-CPL: TiddlyWiki world of Google App Store! ](https://talk.tiddlywiki.org/t/tiddlywiki-cpl-tiddlywiki-world-of-google-app-store/2140) , this React plugin will be automatically installed as a dependency. So you probably don't need to install this manyally.

(You can also drag `__plugins_linonetwo_tw-react.json` from [Release · tiddly-gittly/tw-react · GitHub](https://github.com/tiddly-gittly/tw-react/releases/latest). But Don't drag them from above demo sites. Because the ReactJS plugin from those demosite is of dev mode, so size is much larger than the one in the CPL and Github release!)

## Trouble shotting

### React is undefined

You may need `import React from 'react';` on the top of jsx file, even you are in react 17+ and not using this variable...

### My css is not loading

See things in your `dist/plugins/xxx/yyy`, is there a `zzz.css` file?

Then you will need to create a `zzz.css.meta` file in your src folder:

```tid
title: $:/plugins/linonetwo/flowtiwi-sidebar/flowtiwi-sidebar.css
tags: $:/tags/Stylesheet
type: text/css
```

### ReferenceError: window is not defined

You may have this error when booting nodejs wiki:

```js
Error executing boot module $:/plugins/linonetwo/tw-whiteboard/widget.js: {}

$:/plugins/linonetwo/tw-whiteboard/widget.js:29527
var AY = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)").matches : false;
         ^

ReferenceError: window is not defined
    at $:/plugins/linonetwo/tw-whiteboard/widget.js:29527:10
    at Script.runInContext (node:vm:139:12)
    at Script.runInNewContext (node:vm:144:17)
```

This is because in nodejs context, there are no `window` object.

You need to only execute your script in browser, like the example in [slate-write](https://github.com/tiddly-gittly/slate-write/blob/a5201885dc839d9b4ce1c25de55b80fb61f08e7b/src/widget.js):

```js
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
(function slateWriteWidgetIIFE() {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!$tw.browser) {
    return;
  }
  // separate the widget from the exports here, so we can skip the require of react code if `!$tw.browser`. Those ts code will error if loaded in the nodejs side.
  const components = require('$:/plugins/linonetwo/slate-write/components/index.js');
  const { widget } = components;
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  exports.slateWrite = widget;
  // fix `Undefined widget 'edit-slateWrite'`
  exports['edit-slateWrite'] = widget;
})();
```

While export the widget from [another file](https://github.com/tiddly-gittly/slate-write/blob/a5201885dc839d9b4ce1c25de55b80fb61f08e7b/src/editor/index.ts#L174):

```js
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
exports.widget = SlateWriteWidget;
```
