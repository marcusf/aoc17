const fs = require('fs');

let solve1 = (s) => s.split("\n").map((l) => 
    l.split(" ").sort().reduce((r,w,i,a) => a[i+1] == w ? 0 : r, 1))
  .reduce((a,b) => a+b, 0);

let solve2 = (s) => s.split("\n").map((l) => 
  l.split(" ").map((w) => w.split('').sort().join('')).sort().reduce((r,w,i,a) => a[i+1] == w ? 0 : r, 1))
.reduce((a,b) => a+b, 0);

const INPUT = fs.readFileSync("4.txt", "utf8");
console.log("Solve 1:", solve1(INPUT));
console.log("Solve 2:", solve2(INPUT));