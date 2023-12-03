import { readFileSync } from 'fs';
import { join as joinPath } from 'path';

const input: string = readFileSync(joinPath(__dirname, './input/3.txt'), 'utf-8');

interface SchemaNumber {
  value: number;
  x: number;
  y: number;
  length: number;
  isPart: boolean;
}

interface Schematic {
  lines: string[];
  width: number;
  height: number;
  substr: (x: number, y: number, length: number) => string
  numbers: SchemaNumber[];
}

function parseSchematic(input: string): Schematic {
  const lines: string[] = input.split('\n');

  const height = lines.length;
  const width = lines[0].length;

  const substr = (x: number, y: number, length: number): string => {
    if (y < 0 || y >= height) return '';

    return lines[y].substring(Math.max(0, x), Math.min(width, x + length));
  }

  const SYMBOL_RE = /[^\.0-9]/;
  const isPart = (x: number, y: number, length: number): boolean => (
    SYMBOL_RE.test(substr(x - 1, y - 1, length + 2)) ||
    SYMBOL_RE.test(substr(x - 1, y,     length + 2)) ||
    SYMBOL_RE.test(substr(x - 1, y + 1, length + 2))
  );

  const numbers: SchemaNumber[] = [];
  lines.forEach((line, y) => {
    const number_re = /[0-9]+/g;
    let result: RegExpMatchArray;
    while (result = number_re.exec(line)) {
      const value: number = parseInt(result[0]);
      const length: number = result[0].length;
      const x = number_re.lastIndex - length;
      numbers.push({
        x, y, value, length,
        isPart: isPart(x, y, length)
      });
    }
  });

  return { lines, width, height, substr, numbers };
}

interface Gear {
  x: number;
  y: number;
}

function findGears(schematic: Schematic): Gear[] {
  const gears: Gear[] = [];

  schematic.lines.forEach((line, y) => {
    let x = -1;
    while ((x = line.indexOf('*', x + 1)) != -1)
      gears.push({ x, y });
  });

  return gears;
}

function gearRatio(schematic: Schematic, gear: Gear) {
  const parts = schematic.numbers.filter(part => (
    part.isPart &&
    (gear.x >= (part.x - 1) && gear.x <= (part.x + part.length)) &&
    Math.abs(part.y - gear.y) <= 1
  ));

  if (parts.length != 2)
    return 0;

  return parts[0].value * parts[1].value;
}

const schematic: Schematic = parseSchematic(input);
console.log('Part 1:');
console.log(
  schematic.numbers.filter(num => num.isPart).reduce((acc, { value }) => (acc + value), 0)
);

const gears: Gear[] = findGears(schematic);
console.log('Part 2:');
console.log(
  gears.map(gear => gearRatio(schematic, gear)).reduce((acc, ratio) => (acc + ratio))
);
