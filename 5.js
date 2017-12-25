const fs = require('fs');

let solve1 = (input) => {
  let jmps = input.split("\n").map((s)=>parseInt(s));
  let ptr = 0, incr = 0, steps = 0;
  while (true) {
    incr = jmps[ptr];
    jmps[ptr]++;
    steps++;
    ptr += incr;
    if (ptr > jmps.length-1) {
      return steps;
    }
  }
}

let solve2 = (input) => {
  let jmps = input.split("\n").map((s)=>parseInt(s));
  let ptr = 0, incr = 0, steps = 0;
  while (true) {
    incr = jmps[ptr];
    jmps[ptr] += jmps[ptr] >= 3 ? -1 : 1;
    steps++;
    ptr += incr;
    if (ptr > jmps.length-1) {
      return steps;
    }
  }
}

const INPUT = fs.readFileSync("5.txt", "utf8");

console.log("Solve 1:", solve1(INPUT));
console.log("Solve 2:", solve2(INPUT));
