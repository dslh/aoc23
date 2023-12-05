import { readFileSync } from 'fs';
import { join as joinPath } from 'path';

const input: string = readFileSync(joinPath(__dirname, './input/5.txt'), 'utf-8');

interface Mapping {
  dest: number;
  source: number;
  range: number;

  map: (n: number) => number | undefined;
}

interface Mappings {
  ranges: Mapping[];
  map: (n: number) => number;
}

function parseMapping(line: string): Mapping {
  const [dest, source, range] = line.split(' ').map(n => parseInt(n));

  const shift = dest - source;
  const limit = source + range;
  const map = (n: number): number | undefined => {
    if (n >= source && n < limit)
      return n + shift;
  }

  return { dest, source, range, map };
}

function parseMappings(section: string): Mappings {
  const ranges: Mapping[] = section.split('\n').map(parseMapping);

  const map = (n: number): number => {
    for (let range of ranges) {
      const out = range.map(n);
      if (out !== undefined)
        return out;
    }

    return n;
  }

  return { ranges, map };
}

function parseInput(input: string): [number[], Mappings[]] {
  const [seedStr, ...sections] = input.split(/\n\n\w+-to-\w+ map:\n/m);

  const seeds = seedStr.split(': ')[1].split(' ').map(n => parseInt(n));

  return [seeds, sections.map(parseMappings)];
}

const [seeds, mappings] = parseInput(input);

const mapSeed = (seed: number): number => (
  mappings.reduce((acc, mapping) => mapping.map(acc), seed)
);

console.log('Part 1:');
console.log(Math.min(...seeds.map(mapSeed)));

let min = Number.MAX_SAFE_INTEGER;
for (let i = 0; i < seeds.length; i += 2) {
  const start = seeds[i];
  const end = start + seeds[i + 1];
  for (let j = start; j < end; ++j) {
    min = Math.min(min, mapSeed(j));
  }
}
console.log('Part 2:');
console.log(min);
