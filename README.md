# TiddlyWiki React

[What’s your opinion about using ReactJS in the plugin?](https://talk.tiddlywiki.org/t/whats-your-opinion-about-using-reactjs-in-the-plugin/2191) Sometimes it is inevitable to use ReactJS in the widget, for example, JSONSchemaForm.

## Products

When installing

1. [Smart Form plugin - beta release - Display different form based on the tag you add](https://talk.tiddlywiki.org/t/smart-form-plugin-beta-release-display-different-form-based-on-the-tag-you-add/2417)
2. [FlowTiwi - a Multi-column draggable resizable sidebar (beta release)](https://talk.tiddlywiki.org/t/flowtiwi-a-multi-column-draggable-resizable-sidebar-beta-release/3128)
3. [Demo of a new WYSIWYG editor: slate-write (unstable alpha stage)](https://talk.tiddlywiki.org/t/demo-of-a-new-wysiwyg-editor-slate-write-unstable-alpha-stage/2788)

from [TiddlyWiki-CPL: TiddlyWiki world of Google App Store! ](https://talk.tiddlywiki.org/t/tiddlywiki-cpl-tiddlywiki-world-of-google-app-store/2140) , this React plugin will be automatically installed as a  dependency. So you probably don't need to install this manyally.

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
