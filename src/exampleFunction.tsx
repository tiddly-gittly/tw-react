import { useEffect, useState } from 'react';

export function ExampleFunction() {
  const [counter, counterSetter] = useState(0);
  useEffect(() => {
    // not using counter variable to prevent hook reinvoke every time counter changed
    let localCounter = 0;
    const handle = setInterval(() => {
      counterSetter(++localCounter);
    }, 1000);
    return () => {
      clearInterval(handle);
    };
  }, []);
  return <span>{counter}</span>;
}
