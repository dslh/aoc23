import { readInputLines } from './input/read';

const input: string[] = readInputLines(7);

interface Hand {
  cards: string;
  bid: number;
  ordinal: string;
}

function cardFreqs(cards: string): { [card: string]: number } {
  const freqs = {};
  for (const card of cards) {
    freqs[card] = (freqs[card] || 0) + 1;
  }
  return freqs;
}

const CARD_VALUES: { [card: string]: string } = {
  '2': 'a',
  '3': 'b',
  '4': 'c',
  '5': 'd',
  '6': 'e',
  '7': 'f',
  '8': 'g',
  '9': 'h',
  'T': 'i',
  'J': 'j',
  'Q': 'k',
  'K': 'l',
  'A': 'm'
};
// Convert hands into strings that can be sorted by string order
function handOrdinal(cards: string): string {
  const cardValues = cards.replace(/./g, c => CARD_VALUES[c]);

  const handValue = Object.values(cardFreqs(cards)).sort().reverse().join('');

  return `${handValue}: ${cardValues}`;
}

function parseHand(line: string): Hand {
  const [cards, bid] = line.split(' ');

  return {
    cards,
    bid: parseInt(bid),
    ordinal: handOrdinal(cards)
  };
}

const hands = input.map(parseHand);
hands.sort(({ ordinal: a }, { ordinal: b }) => a.localeCompare(b));

console.log('Part 1:');
console.log(
  hands.map(({ bid }, i) => bid * (i + 1)).reduce((acc, winnings) => acc + winnings)
);
