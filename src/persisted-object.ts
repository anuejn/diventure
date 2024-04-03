type Callback = () => void;
export type PersistedObject<T> = {
  on: (callback: Callback) => void;
} & T;

export function makePersistedObject<T>(
  storageKey: string,
  init: T,
): PersistedObject<T> {
  let value = init;

  const stored = localStorage.getItem(storageKey);
  if (stored) {
    value = JSON.parse(stored);
  }

  type TypeInProxy = {
    value: T;
    path: (keyof T)[];
    listeners: Callback[];
  };

  const target = { value, path: [], listeners: [] };

  window.addEventListener("storage", (e) => {
    if (e.key == storageKey) {
      target.value = JSON.parse(e.newValue || "{}");
      for (const callback of target.listeners) {
        (callback as Callback)();
      }
    }
  });

  const makeProxy = (path: (keyof T)[]): T =>
    new Proxy<TypeInProxy>(target, {
      get(target, p) {
        if (p == "toJSON") {
          return () => target.value;
        }

        if (p == "on") {
          return (callback: Callback) => {
            target.listeners.push(callback);
            callback();
          };
        }

        const key = p as keyof T;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let parent = target.value as any;
        for (const segment of path) {
          parent = Reflect.get(parent, segment);
        }

        const value = Reflect.get(parent, key);
        if (typeof value == "object" && value != null) {
          return makeProxy([...path, key]);
        } else if (typeof value == "function") {
          return value.bind(parent);
        } else {
          return value;
        }
      },
      set(target, p, newValue) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let parent = target.value as any;
        for (const segment of path) {
          parent = Reflect.get(parent, segment);
        }

        Reflect.set(parent, p, newValue);

        localStorage.setItem(storageKey, JSON.stringify(target.value));
        for (const callback of target.listeners) {
          callback();
        }
        return true;
      },
    }) as T;

  return makeProxy([]) as PersistedObject<T>;
}
