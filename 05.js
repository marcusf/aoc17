const fs = require('fs');

let solve = (l, part) => {
  let jmps = l.split("\n").map(s=>+s), p = 0, i = 0, c = 0;
  while (++c) {
    i = jmps[p];
    jmps[p] += !part ? 1 : jmps[p] >= 3 ? -1 : 1;
    p += i;
    if (p > jmps.length-1) return c;
  }
}

const INPUT = fs.readFileSync("5.txt", "utf8");
console.log("1:", solve(INPUT, 0), " 2:", solve(INPUT, 1));
