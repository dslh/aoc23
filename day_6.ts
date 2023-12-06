import { readFileSync } from 'fs';
import { join as joinPath } from 'path';

const input: string = readFileSync(joinPath(__dirname, './input/6.txt'), 'utf-8');

interface Race {
  time: number;
  best: number;
}

function parseRaces(input: string): Race[] {
  const [times, distances] = input.split('\n').map(line =>
    line.split(':')[1].match(/\d+/g).map(n => parseInt(n))
  );

  return times.map((time, i) => ({ time, best: distances[i] }));
}

function winningRange({ time, best }: Race): [number, number] {
  const root = Math.sqrt(time ** 2 - 4 * (best + 0.01));
  return [
    Math.ceil((-time + root) / -2),
    Math.floor((-time - root) / -2)
  ];
}

function winningOptions(race: Race): number {
  const [min, max] = winningRange(race);
  return max - min + 1;
}

console.log('Part 1:');
console.log(parseRaces(input).map(winningOptions).reduce((acc, options) => acc * options, 1));

function parseRace(input: string): Race {
  const [time, best] = input.split('\n').map(line => parseInt(line.replace(/\D/g, '')));

  return { time, best };
}

console.log('Part 2:');
console.log(winningOptions(parseRace(input)));
