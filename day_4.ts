import { readFileSync } from 'fs';
import { join as joinPath } from 'path';

const input: string = readFileSync(joinPath(__dirname, './input/4.txt'), 'utf-8');

interface Scratchcard {
  id: number;
  winning: number[];
  held: number[];
  matches: number;
}

const CARD_RE = /Card +(\d+): +((\d+ +)+)\|(( +\d+)+)/

function cardMatches(winning: number[], held: number[]): number {
  const lookup: boolean[] = [];
  winning.forEach(i => lookup[i] = true);

  return held.filter(i => lookup[i]).length;
}

function cardScore(matches: number): number {
  return matches && 2 ** (matches - 1);
}

function parseCard(line: string): Scratchcard {
  const match = line.match(CARD_RE);

  const parseInts = (ints: string) => ints.split(' ').filter(i => i.length).map(i => parseInt(i));

  const id = parseInt(match[1]);
  const winning = parseInts(match[2]);
  const held = parseInts(match[4]);
  const matches = cardMatches(winning, held);

  return { id, winning, held, matches };
}

const cards: Scratchcard[] = input.split('\n').map(parseCard);

const cardCounts: number[] = [];
for (let i = cards.length - 1; i >= 0; --i) {
  const { id, matches } = cards[i];
  cardCounts[i] = 1 + cardCounts.slice(id, id + matches)
                                .reduce((a, n) => a + n, 0);
}

console.log('Part 1:');
console.log(
  cards.reduce((acc, { matches }) => acc + cardScore(matches), 0)
);
console.log('Part 2:');
console.log(cardCounts.reduce((a, i) => a + i));
