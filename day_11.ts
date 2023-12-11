import { readInputLines } from './input/read';

const input: string[] = readInputLines(11);

interface Galaxy {
  x: number;
  y: number;
}

function findGalaxies(input: string[]): Galaxy[] {
  const galaxies: Galaxy[] = [];

  input.forEach((line, y) => {
    let x: number = -1;
    while((x = line.indexOf('#', x + 1)) !== -1)
      galaxies.push({ x, y });
  });

  return galaxies;
}

function findGaps(sortedArray: number[]): number[] {
  const gaps: number[] = [];

  for (let i = 1; i < sortedArray.length; ++i)
    for (let j = sortedArray[i - 1] + 1; j < sortedArray[i]; ++j)
      gaps.push(j);

  return gaps;
}

function expandDimension(galaxies: Galaxy[], dimension: 'x' | 'y', amount) {
  const sorted = [...galaxies].sort((a, b) => a[dimension] - b[dimension]);
  const gaps = findGaps(sorted.map(g => g[dimension]));

  let shift = 0;
  let i = 0;
  for (const gap of gaps) {
    while(sorted[i][dimension] < gap) {
      sorted[i++][dimension] += shift;
    }
    shift += amount
  }

  for (; i < sorted.length; ++i)
    sorted[i][dimension] += shift;
}

function distance(a: Galaxy, b: Galaxy): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function allDistances(galaxies: Galaxy[]): number {
  let sum = 0;
  for (let i = 1; i < galaxies.length; ++i)
    for (let j = 0; j < i; ++j)
      sum += distance(galaxies[i], galaxies[j]);
  return sum;
}

console.log('Part 1:');
const galaxies = findGalaxies(input);
expandDimension(galaxies, 'x', 1);
expandDimension(galaxies, 'y', 1);
console.log(allDistances(galaxies));

console.log('Part 2:');
const oldGalaxies = findGalaxies(input);
expandDimension(oldGalaxies, 'x', 999_999);
expandDimension(oldGalaxies, 'y', 999_999);
console.log(allDistances(oldGalaxies));
