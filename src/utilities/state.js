export const searchState = new Proxy(
  {
    offset: 0,
    listeners: [],
    listen: (fn) => searchState.listeners.push(fn),
  },
  {
    set: (target, key, value) => {
      if (key === "listen" || key === "listeners") return false;
      target[key] = value;
      target.listeners.map((fn) => fn());
      return true;
    },
  },
);
