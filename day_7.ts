import { readInputLines } from './input/read';

const input: string[] = readInputLines(7);

interface Hand {
  cards: string;
  bid: number;
  ordinal: string;
  jokerOrdinal: string;
}

function cardFreqs(cards: string): { [card: string]: number } {
  const freqs = {};
  for (const card of cards) {
    freqs[card] = (freqs[card] || 0) + 1;
  }
  return freqs;
}

const CARD_VALUES: { [card: string]: string } = {
  '2': 'b',
  '3': 'c',
  '4': 'd',
  '5': 'e',
  '6': 'f',
  '7': 'g',
  '8': 'h',
  '9': 'i',
  'T': 'j',
  'J': 'k',
  'Q': 'l',
  'K': 'm',
  'A': 'n'
};
// Convert hands into strings that can be sorted by string order
function handOrdinal(cards: string): string {
  const cardValues = cards.replace(/./g, c => CARD_VALUES[c]);

  const handValue = Object.values(cardFreqs(cards)).sort().reverse().join('');

  return `${handValue}: ${cardValues}`;
}

const JOKER_CARD_VALUES = { ...CARD_VALUES };
JOKER_CARD_VALUES.J = 'a';
function jokerHandOrdinal(cards: string): string {
  const cardValues = cards.replace(/./g, c => JOKER_CARD_VALUES[c]);

  const freqs = cardFreqs(cards);
  const jokers = freqs.J || 0;
  delete freqs.J;

  const values = Object.values(freqs).sort().reverse();
  values[0] = (values[0] || 0) + jokers;

  return `${values.join('')}: ${cardValues}`;
}

function parseHand(line: string): Hand {
  const [cards, bid] = line.split(' ');

  return {
    cards,
    bid: parseInt(bid),
    ordinal: handOrdinal(cards),
    jokerOrdinal: jokerHandOrdinal(cards)
  };
}

function totalWinnings(hands: Hand[]) {
  return hands.map(({ bid }, i) => bid * (i + 1)).reduce((acc, winnings) => acc + winnings);
}

const hands = input.map(parseHand);

console.log('Part 1:');
hands.sort(({ ordinal: a }, { ordinal: b }) => a.localeCompare(b));
console.log(totalWinnings(hands));

console.log('Part 2:');
hands.sort(({ jokerOrdinal: a }, { jokerOrdinal: b }) => a.localeCompare(b));
console.log(totalWinnings(hands));
