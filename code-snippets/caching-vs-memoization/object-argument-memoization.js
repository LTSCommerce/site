const cache = new Map();

function memoized(obj) {
  if (cache.has(obj)) return cache.get(obj);
  // ...
}

memoized({ id: 1 }); // Cache miss
memoized({ id: 1 }); // Cache miss again! Different object reference
