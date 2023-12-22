import { readInputLines } from './input/read';
import Queue from './lib/queue';

const input: string[] = readInputLines(20).filter(line => ['b', '%', '&'].includes(line[0]));

interface Pulse {
  src: string;
  dest: string;
  high: boolean;
}

interface Module {
  name: string;
  outputs: string[];

  attach: (input: string) => void;
  receive: (pulse: Pulse) => boolean | undefined;
  toString: () => string;
}

function Broadcaster(name: string, outputs: string[]): Module {
  return {
    name, outputs,
    attach: () => {},
    receive: ({ high }: Pulse) => high,
    toString: () => 'broadcaster'
  };
}

function FlipFlop(name: string, outputs: string[]): Module {
  let state = false;

  return {
    name, outputs,
    attach: () => {},
    receive: ({ high }: Pulse) => {
      if (high) return;

      state = !state;
      return state;
    },
    toString: () => `%${name}${state ? '+' : '-'}`
  };
}

function Conjunction(name: string, outputs: string[]): Module {
  const memory: { [input: string]: boolean } = {};

  return {
    name, outputs,
    attach: (name: string) => { memory[name] = false; },
    receive: ({ src, high }: Pulse) => {
      memory[src] = high;
      return !Object.values(memory).every(high => high);
    },
    toString: () => `&${name} (${
      Object.keys(memory).map(input => `${input}${memory[input] ? '+' : '-'}`).join(' ')
    })`
  };
}

type ModuleConstructor = (name: string, outputs: string[]) => Module;
const MODULE_SYMBOLS: { [sym: string]: ModuleConstructor } = {
  '%': FlipFlop,
  '&': Conjunction
}
function parseModule(line: string): Module {
  const [name, out] = line.split(' -> ');
  const outputs = out.split(', ');

  const constructor = MODULE_SYMBOLS[name[0]];
  if (constructor)
    return constructor(name.slice(1), outputs);

  return Broadcaster(name, outputs);
}

class Network {
  modules: { [name: string]: Module } = {};
  pulses: Queue<Pulse> = new Queue<Pulse>();

  highs = 0;
  lows = 0;
  pushes = 0;

  constructor(modules: Module[]) {
    modules.forEach(module => this.modules[module.name] = module);

    for (const { name, outputs } of modules)
      for (const output of outputs) {
        const module = this.modules[output];
        if (module)
          module.attach(name);
      }
  }

  pushButton() {
    this.pushes++;
    this.pulses.push({ src: 'button', dest: 'broadcaster', high: false });

    while (!this.pulses.empty)
      this.pulse(this.pulses.pop());
  }

  pulse(pulse: Pulse) {
    if (pulse.high)
      this.highs++;
    else
      this.lows++;

    const module = this.modules[pulse.dest];
    if (!module) return;

    const high = module.receive(pulse);
    if (high === undefined) return;

    for (const dest of module.outputs)
      this.pulses.push({ src: module.name, high, dest });
  }

  awaitRx() {
    let interrupt = false;
    this.modules['rx'] = {
      name: 'rx', outputs: [], attach: () => {},
      receive: ({ high }: Pulse) => {
        if (!high) interrupt = true;

        return undefined;
      }
    };

    while (!interrupt)
      this.pushButton();
  }
}

console.log('Part 1:');
const network = new Network(input.map(parseModule));
for (let i = 0; i < 1000; i++)
  network.pushButton();
console.log(network.highs * network.lows);

/**
 * The broadcast module sends to four flip-flops.
 * Each one is the entry point to an isolated subsystem.
 * Each subsystem has a single output, a conjunction module
 * that itself has only one output and only one input.
 * All four subsystems output to a conjunction module, and
 * this conjunction module outputs to rx, the target.
 *
 * Each subsystem is set up to output a high value once every
 * n button pushes, where the n-values for all subsystems are
 * coprime.
 *
 * To solve part two, remove the output conjunction module
 * from three of the four subsystems and run the code below,
 * noting the value of rxNetwork.pushes. Repeat this for the
 * other three subsystems, then multiply the four values to
 * get the answer for part 2.
 */
console.log('Part 2:');
const rxNetwork = new Network(input.map(parseModule));
rxNetwork.awaitRx();
console.log(rxNetwork.pushes);
