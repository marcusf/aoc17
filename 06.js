const fs = require('fs');

const rebalance = state => {
  let [spread,i] = state.reduce(([s,i],x,n) => x > s ? [x,n]:[s,i], [0,0]);
  state[i] = 0;
  while (spread-- > 0 && ++i) state[i%state.length]++;
  return state;
}

const solve = f => {
  let state = f.split(' ').map(s => +s), seen = {}, steps = 0;
  seen[state] = 0;
  while (++steps && !(rebalance(state) in seen)) seen[state] = steps;
  return {steps: steps, cycle: steps-seen[state]};
}

console.log("Solve", solve(fs.readFileSync("6.txt", "utf8")));
