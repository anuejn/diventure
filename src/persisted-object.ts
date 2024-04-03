type Callback<T> = (lastState: T | undefined) => void;
export type PersistedObject<T> = {
  on: (callback: Callback<T>) => void;
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
    listeners: Callback<T>[];
  };

  const target = { value, path: [], listeners: [] };

  window.addEventListener("storage", (e) => {
    if (e.key == storageKey) {
      const lastState = JSON.parse(JSON.stringify(target.value));
      target.value = JSON.parse(e.newValue || "{}");
      for (const callback of target.listeners) {
        (callback as Callback<T>)(lastState);
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
          return (callback: Callback<T>) => {
            target.listeners.push(callback);
            callback(undefined);
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
        const lastState = JSON.parse(JSON.stringify(target.value));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let parent = target.value as any;
        for (const segment of path) {
          parent = Reflect.get(parent, segment);
        }

        Reflect.set(parent, p, newValue);

        localStorage.setItem(storageKey, JSON.stringify(target.value));
        for (const callback of target.listeners) {
          callback(lastState);
        }
        return true;
      },
    }) as T;

  return makeProxy([]) as PersistedObject<T>;
}
