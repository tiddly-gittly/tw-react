/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="type.d.ts" />
/**
 * This file exports things that can be imported from $:/plugins/linonetwo/tw-react/index.js
 */
import { ParentWidgetContext, useFilter, useRenderTiddler, useWidget } from './hooks';

declare let exports: {
  ParentWidgetContext: typeof ParentWidgetContext;
  useFilter: typeof useFilter;
  useRenderTiddler: typeof useRenderTiddler;
  useWidget: typeof useWidget;
};
exports.ParentWidgetContext = ParentWidgetContext;
exports.useFilter = useFilter;
exports.useRenderTiddler = useRenderTiddler;
exports.useWidget = useWidget;
