export function sum<T>(ary: T[], mapFn?: (o: T) => number): number {
  return ary.map(mapFn).reduce((acc, n) => acc + n, 0);
}

export function max<T>(ary: T[], mapFn?: (o: T) => number): T | undefined {
  if (ary.length === 0) return;

  let out: T = ary[0];
  let max = mapFn(out);
  for (let i = 1; i < ary.length; ++i) {
    const o = ary[i];
    const n = mapFn(o);
    if (n > max) {
      max = n;
      out = o;
    }
  }

  return out;
}

export function eachPair<T>(ary: T[], callback: (a: T, b: T) => any) {
  for (let i = 0; i < ary.length - 1; ++i) {
    for (let j = i + 1; j < ary.length; ++j) {
      callback(ary[i], ary[j]);
    }
  }
}

export function eachConsPair<T>(ary: T[], callback: (a: T, b: T) => any) {
  for (let i = 1; i < ary.length; ++i)
    callback(ary[i - 1], ary[i]);
}

export function eachTriplet<T>(ary: T[], callback: (triplet: T[]) => any) {
  for (let i = 0; i + 2 < ary.length; ++i) {
    for (let j = i + 1; j + 1 < ary.length; ++j) {
      for (let k = j + 1; k < ary.length; ++k) {
        callback([ary[i], ary[j], ary[k]]);
      }
    }
  }
}

export function tripletMap<T, V>(ary: T[], callback: (triplet: T[]) => V): V[] {
  const out: V[] = [];

  eachTriplet(ary, (triplet: T[]) => { out.push(callback(triplet)); });

  return out;
}

export function sample<T>(ary: T[]): T {
  return ary[Math.floor(Math.random() * ary.length)];
}
