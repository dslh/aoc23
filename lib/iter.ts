export function eachPair<T>(ary: T[], callback: (a: T, b: T) => any) {
  for (let i = 0; i < ary.length - 1; ++i) {
    for (let j = i + 1; j < ary.length; ++j) {
      callback(ary[i], ary[j]);
    }
  }
}
