/**
 * This is a utility that throws a specific error when it is accessed.
 */

export function makeNotPresentObject<T>(error: string): T {
  const fn = () => {
    throw Error(error);
  };
  const toTrap = [
    "apply",
    "construct",
    "defineProperty",
    "deleteProperty",
    "get",
    "getOwnPropertyDescriptor",
    "getPrototypeOf",
    "has",
    "isExtensible",
    "ownKeys",
    "preventExtensions",
    "set",
    "setPrototypeOf",
  ];
  return new Proxy(
    { error: error },
    Object.fromEntries(toTrap.map((key) => [key, fn])),
  ) as T;
}
