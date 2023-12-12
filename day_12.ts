import { readInputLines } from './input/read';

const input: string[] = readInputLines(12);

interface Record {
  row: string;
  groups: number[];
}

function parseRecord(line: string): Record {
  const [row, groupStr] = line.split(' ');

  const groups = groupStr.split(',').map(n => parseInt(n));

  return { row, groups };
}

const records = input.map(parseRecord);

function countPermutations(row: string, groups: number[], remainder: number): number {
  if (groups.length === 0)
    return (row.indexOf('#') === -1) ? 1 : 0;

  let count = 0;
  const group = groups.pop();

  for (let i = 0; i <= row.length - remainder; ++i) {
    if (row[i - 1] === '#') break;

    if (row.slice(i, i + group).indexOf('.') === -1 && row[i + group] !== '#')
      count += countPermutations(row.slice(i + group + 1), groups, remainder - group - 1);
  }

  groups.push(group);
  return count;
}

function countAllPermutations({ row, groups }: Record): number {
  const requiredLength = groups.reduce((acc, n) => acc + n) + groups.length - 1;
  return countPermutations(row, [...groups].reverse(), requiredLength);
}

function unfold(record: Record, times: number = 5): Record {
  const row: string = Array(times).fill(record.row).join('?');
  const groups: number[] = [];
  for (let i = 0; i < times; ++i)
    groups.push(...record.groups);

  return { row, groups };
}

console.log('Part 1:');
console.log(records.map(countAllPermutations).reduce((acc, n) => acc + n));

console.log('Part 2:');
let total = 0;
for (const record of records) {
  const unfolded = unfold(record);
  console.log(unfolded);
  const count = countAllPermutations(unfolded);
  console.log(count);
  total += count;
}
console.log(total);
