import { useEffect, useState, useMemo } from 'react';

/** Filter result is basically a list of title. You can get tiddler detail using tw API like `$tw.wiki.getTiddler` */
export function useFilter(twFilter: string, dependencies: any[] = []) {
  const [filterResult, setFilterResult] = useState<string[]>([]);
  const compiledFilter = useMemo(() => $tw.wiki.compileFilter(twFilter), [twFilter]);
  useEffect(() => {
    setFilterResult(compiledFilter());
  }, [compiledFilter, ...dependencies]);
  return filterResult;
}
