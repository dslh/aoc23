import { readFileSync } from 'fs';
import { join as joinPath } from 'path';

const input: string = readFileSync(joinPath(__dirname, './input/2.txt'), 'utf-8');

interface Game {
  id: number;
  red: number;
  green: number;
  blue: number;
}

function parseGame(input: string): Game {
  const [id, draws] = input.split(': ');

  const game: Game = { id: parseInt(id.split(' ')[1]), red: 0, green: 0, blue: 0 };

  draws.split(/[,;] /).map(draw => {
    const [quantity, colour] = draw.split(' ');
    game[colour] = Math.max(game[colour], parseInt(quantity));
  });

  return game;
}

function parseInput(input: string): Game[] {
  return input.split('\n').map(line => parseGame(line));
}

function isPossible({ red, green, blue }: Game): boolean {
  return red <= 12 && green <= 13 && blue <= 14;
}

function gamePower({ red, green, blue }: Game): number {
  return red * green * blue;
}

const games: Game[] = parseInput(input);

console.log('Part 1:');
console.log(
  games.filter(isPossible).reduce((acc, { id }) => (acc + id), 0)
);

console.log('Part 2:');
console.log(
  games.map(gamePower).reduce((acc, power) => (acc + power), 0)
);

