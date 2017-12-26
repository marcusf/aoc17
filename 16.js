const fs = require('fs');

const DANCERS = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p'];

const spin = (steps) => (state) => {
  let idx = state.length - steps;
  let start = state.slice(0, idx);
  let end = state.slice(idx);
  return end.concat(start);
}

const exchange = (a,b) => (state) => {
  let tmp = state[a];
  state[a] = state[b];
  state[b] = tmp;
  return state;
}

const partner = (a,b) => (state) => {
  let aa = state.indexOf(a), bb = state.indexOf(b);
  let tmp = state[aa];
  state[aa] = state[bb];
  state[bb] = tmp;
  return state;
}

const parseOp = (op) => {
  if (op[0] == 's') { return spin(op.slice(1));
  } else if (op[0] == 'x') {
    let hit = /x(\d+)\/(\d+)/.exec(op); return exchange(parseInt(hit[1]),parseInt(hit[2]));
  } else if (op[0] == 'p') { return partner(op[1], op[3]);
  }
}

const solve1 = (input, dancers) => {
  let cpu = input.split(",").map((op) => parseOp(op));
  let output = cpu.reduce((state, instruction) => instruction(state), dancers);
  console.log(output.join(""));
  return output;
}

const solve2 = (input, dancers) => {
  let cpu = input.split(",").map((op) => parseOp(op));

  let output = dancers, previous = new Set, hasJumped = false;
  let i = 0;
  const TARGET = 1000*1000*1000-1;
  while (i < TARGET) {
    output = cpu.reduce((state, instruction) => instruction(state), output);
    i++;
    if (!hasJumped) {
      // We found a cycle and don't have to recompute. 
      // I put a guard in to do this just once as I am lazy.
      if (previous.has(output.join(""))) {
      hasJumped = true;
      let cycle = i-1;
      while (i <= TARGET-cycle) i+= cycle;
      } else {
        previous.add(output.join(""));
      }
    }
  }
  console.log(i,output.join(""));
}
const INPUT = fs.readFileSync("16.txt", "utf8");
let dance2 = solve1(INPUT, DANCERS.slice());
solve2(INPUT, dance2);










