const Tape = require('./tape').Tape;
const fs = require('fs');

const parse = (input) => {
  let data = input.split("\n");
  let numStates = (data.length - 3)/10;
  let {start, checksum} = readHead(data.slice(0,2));
  let states = {};
  let state = '', instructions = [];
  for (i = 3; i < data.length; i+=10) {
    ({state, instructions} = readState(data.slice(i,i+10)));
    states[state] = instructions;
  }
  return [start, checksum, states];
}

const readHead = (head) => {
  let start = /Begin in state ([A-Z])./.exec(head[0])[1];
  let checksumAfter = parseInt(/Perform a diagnostic checksum after (\d+) steps./.exec(head[1])[1]);
  return {start: start, checksum: checksumAfter};
}

const readState = (state) => {
  let stateId = /In state ([A-Z]):/.exec(state[0])[1];
  let if0 = readInstruction(state.slice(1,5));
  let if1 = readInstruction(state.slice(5,9));
  return { state: stateId, instructions: [if0, if1] };
}

const readInstruction = (instr) => {
  const lines = [
    /  If the current value is (\d):/,
    /    - Write the value (\d)./,
    /    - Move one slot to the (right|left)./,
    /    - Continue with state ([A-Z])./
  ];
  let res = instr.map((line,i) => lines[i].exec(line)[1]);
  return { write: parseInt(res[1]), move: res[2], next: res[3] };
}

const solve = (input) => {
  let [start, iterations, states] = parse(INPUT);
  let tape = new Tape;
  let state = start;
  for (let i = 1; i <= iterations; i++) {
    let instruction = states[state][tape.read()];
    tape.write(instruction.write);
    tape.move(instruction.move);
    state = instruction.next;
  }
  let checksum = 0, count = 0, s = '';
  for (v of tape) {
    count++;
    checksum += v;
  }
  console.log(checksum);
}

const INPUT = fs.readFileSync("25.txt", "utf8");
solve(INPUT);
