type Callback<T> = (newState: T, lastState: T | undefined) => void;
export type PersistedObject<T> = {
  subscribe: (callback: Callback<T>) => void;
  subscribeChild: <K extends keyof T>(
    child: K,
    callback: Callback<T[K]>,
  ) => void;
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
        (callback as Callback<T>)(target.value, lastState);
      }
    }
  });

  const getParent = (target: TypeInProxy, path: (keyof T)[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parent = target.value as any;
    for (const segment of path) {
      parent = Reflect.get(parent, segment);
    }

    return parent;
  };

  const makeProxy = (path: (keyof T)[]): T =>
    new Proxy<TypeInProxy>(target, {
      get(target, p) {
        if (p == "toJSON") {
          return () => target.value;
        }

        if (p == "subscribe") {
          return (callback: Callback<T>) => {
            target.listeners.push(callback);
            callback(target.value, undefined);
          };
        }

        if (p == "subscribeChild") {
          return <K extends keyof T>(child: K, callback: Callback<T[K]>) => {
            target.listeners.push((newState, lastState) => {
              if (
                lastState != undefined &&
                JSON.stringify(newState[child]) !=
                  JSON.stringify(lastState[child])
              ) {
                callback(newState[child], lastState[child]);
              }
            });
            callback(target.value[child], undefined);
          };
        }

        const parent = getParent(target, path);
        const value = Reflect.get(parent, p);
        if (typeof value == "object" && value != null) {
          return makeProxy([...path, p as keyof T]);
        } else if (typeof value == "function") {
          return value.bind(parent);
        } else {
          return value;
        }
      },
      has(target, p) {
        const parent = getParent(target, path);
        return Reflect.has(parent, p);
      },
      set(target, p, newValue) {
        const lastState = JSON.parse(JSON.stringify(target.value));

        const parent = getParent(target, path);
        Reflect.set(parent, p, newValue);

        localStorage.setItem(storageKey, JSON.stringify(target.value));
        for (const callback of target.listeners) {
          callback(target.value, lastState);
        }
        return true;
      },
      deleteProperty(target, p) {
        const lastState = JSON.parse(JSON.stringify(target.value));

        const parent = getParent(target, path);
        Reflect.deleteProperty(parent, p);

        localStorage.setItem(storageKey, JSON.stringify(target.value));
        for (const callback of target.listeners) {
          callback(target.value, lastState);
        }
        return true;
      },
    }) as T;

  return makeProxy([]) as PersistedObject<T>;
}
