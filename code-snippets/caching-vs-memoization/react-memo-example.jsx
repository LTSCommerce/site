import React, { useState, useMemo, useCallback, memo } from 'react';

// Memoized component - only re-renders if props change
const ExpensiveComponent = memo(({ data, onProcess }) => {
  console.log('ExpensiveComponent rendered');
  return (
    <div>
      <h3>Processed Data</h3>
      <button onClick={onProcess}>Process</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
});

function ParentComponent() {
  const [count, count] = useState(0);
  const [items, setItems] = useState([1, 2, 3, 4, 5]);

  // useMemo - cache computation result
  const processedData = useMemo(() => {
    console.log('Processing data...');
    return items.map(item => item * 2);
  }, [items]); // Only recompute when items change

  // useCallback - cache function reference
  const handleProcess = useCallback(() => {
    console.log('Processing...');
  }, []); // Function reference stays constant

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <ExpensiveComponent
        data={processedData}
        onProcess={handleProcess}
      />
    </div>
  );
}
