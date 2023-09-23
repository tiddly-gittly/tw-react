import { useEffect, useMemo, useState } from 'react';
import { Widget } from 'tiddlywiki';

/** Filter result is basically a list of title. You can get tiddler detail using tw API like `$tw.wiki.getTiddler` */
export function useFilter(twFilter: string, widget: Widget = $tw.rootWidget, dependencies: unknown[] = []): string[] {
  const [filterResult, setFilterResult] = useState<string[]>([]);
  const compiledFilter = useMemo(() => $tw.wiki.compileFilter(twFilter), [twFilter]);
  useEffect(() => {
    setFilterResult(compiledFilter(undefined, widget));
  }, [compiledFilter, widget, ...dependencies]);
  return filterResult;
}
