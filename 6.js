const fs = require('fs');

const key = (array) => array.join("-");

const rebalance = (state) => {
  let {spread,i} = state.reduce((acc,x,i) => {   
    if (x > acc.spread) {
      acc.spread = x;
      acc.i = i;
    }
    return acc }, {spread: 0, i: 0});
  state[i] = 0;
  while (spread > 0) {
    i = (i + 1) % (state.length);
    state[i]++;
    spread--;
  }
  return state;
}

const solve = (f) => {
  let state = f.split(" ").map((s) => parseInt(s));
  let previous = {}, prevList = [], steps = 0;
  previous[key(state)] = 0;
  while (true) {
    steps++;
    rebalance(state);
    let h = key(state);
    if (h in previous) {
      return {steps: steps, cycle: steps-previous[h]};
    } else {
      previous[h] = steps;
    }
  }
}



const INPUT = fs.readFileSync("6.txt", "utf8");

console.log("Solve", solve(INPUT));







