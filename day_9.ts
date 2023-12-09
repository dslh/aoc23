import { readInputLines } from './input/read';
const lcm = require('compute-lcm');

const sequences: number[][] = readInputLines(9).map(
  line => line.split(' ').map(n => parseInt(n))
);

function sequenceDiff(sequence: number[]): number[] {
  const diff: number[] = [];
  for (let i = 1; i < sequence.length; ++i)
    diff.push(sequence[i] - sequence[i - 1]);
  return diff;
}

function nextValue(sequence: number[]): number {
  if (sequence.every(n => n === 0)) return 0;

  return sequence[sequence.length - 1] + nextValue(sequenceDiff(sequence));
}

function prevValue(sequence: number[]): number {
  if (sequence.every(n => n === 0)) return 0;

  return sequence[0] - prevValue(sequenceDiff(sequence));
}

console.log('Part 1:');
console.log(sequences.map(nextValue).reduce((acc, n) => acc + n));

console.log('Part 2:');
console.log(sequences.map(prevValue).reduce((acc, n) => acc + n));
