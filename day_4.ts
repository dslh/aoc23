import { readFileSync } from 'fs';
import { join as joinPath } from 'path';

const input: string = readFileSync(joinPath(__dirname, './input/4.txt'), 'utf-8');

interface Scratchcard {
  id: number;
  winning: number[];
  held: number[];
}

const CARD_RE = /Card +(\d+): +((\d+ +)+)\|(( +\d+)+)/

function parseCard(line: string): Scratchcard {
  const [, id, winning, , held] = line.match(CARD_RE);

  const parseInts = (ints: string) => ints.split(' ').filter(i => i.length).map(i => parseInt(i));

  return {
    id: parseInt(id),
    winning: parseInts(winning),
    held: parseInts(held)
  }
}

const cards: Scratchcard[] = input.split('\n').map(parseCard);

function cardScore({ winning, held }: Scratchcard): number {
  const lookup: boolean[] = [];
  winning.forEach(i => lookup[i] = true);

  const matches: number = held.filter(i => lookup[i]).length;

  if (matches) return 2 ** (matches - 1);

  return 0;
}

console.log('Part 1:');
console.log(
  cards.map(cardScore).reduce((acc, score) => acc + score)
);
