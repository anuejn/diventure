export function makePersistedObject<T>(storageKey: string, init: T): T {
  let value = init;

  const stored = localStorage.getItem(storageKey);
  if (stored) {
    value = JSON.parse(stored);
  }

  type TypeInProxy = {
    value: T;
    path: (keyof T)[];
  };

  const makeProxy = (path: (keyof T)[]): T =>
    new Proxy<TypeInProxy>(
      { value, path: [] },
      {
        get(target, p) {
          const key = p as keyof T;

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let parent = target.value as any;
          for (const segment of path) {
            parent = Reflect.get(parent, segment);
          }

          const value = Reflect.get(parent, key);
          if (typeof value == "object" && value != null) {
            console.log("returning proxy");
            return makeProxy([...path, key]);
          } else if (typeof value == "function") {
            console.log("binding function");
            return value.bind(parent);
          } else {
            console.log("returning primitive");
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
          return true;
        },
      },
    ) as T;

  return makeProxy([]);
}
