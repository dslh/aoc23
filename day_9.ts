import { readInputLines } from './input/read';

const sequences: number[][] = readInputLines(9).map(
  line => line.split(' ').map(n => parseInt(n))
);

function sequenceDiff(sequence: number[]): number[] {
  const diff: number[] = [];
  for (let i = 1; i < sequence.length; ++i)
    diff.push(sequence[i] - sequence[i - 1]);
  return diff;
}

function *continueSequence(sequence: number[]): Generator<number> {
  if (sequence.every(n => n === 0))
    while (true) yield 0;

  const diffGenerator = continueSequence(sequenceDiff(sequence));
  let value = sequence[sequence.length - 1];
  while (true) {
    value += diffGenerator.next().value;
    yield value;
  }
}

function nextValue(sequence: number[]): number {
  return continueSequence(sequence).next().value;
}

function prevValue(sequence: number[]): number {
  return continueSequence([...sequence].reverse()).next().value;
}

console.log('Part 1:');
console.log(sequences.map(nextValue).reduce((acc, n) => acc + n));

console.log('Part 2:');
console.log(sequences.map(prevValue).reduce((acc, n) => acc + n));
