const fs = require('fs');

const hash = (x,y) => x + ',' + y;

const parse = (input) => {
  let lines = input.split("\n");
  let cords = lines.reduce((l,row,y) => l.concat(
    row.split('').reduce((l,col,x) => { if (col == '#') l.push({x:x,y:y}); return l; }, [])),[]);
  let yMid = Math.floor(lines.length / 2), xMid = Math.floor(lines[0].length / 2);
  cords = new Set(cords.map((c) => hash(c.x-xMid, -1*(c.y-yMid))));
  return cords;
}

const isInfected = (set, x, y) => set.has(hash(x,y));
const infect     = (set, x, y) => set.add(hash(x,y));
const clean      = (set, x, y) => set.delete(hash(x,y));

const turnRight = (dx,dy) => dx == 0 ? (dy == 1 ? [1, 0] : dy == -1 ? [-1,0] : [])
                          :  dy == 0 ? (dx == 1 ? [0,-1] : dx == -1 ? [ 0,1] : []) : [];
const turnLeft  = (dx,dy) => dx == 0 ? (dy == 1 ? [-1,0] : dy == -1 ? [ 1,0] : [])
                          :  dy == 0 ? (dx == 1 ? [0, 1] : dx == -1 ? [0,-1] : []) : [];

const solve = (input, iterations) => {
  let pos = parse(input);
  let x = 0, y = 0, dx = 0, dy = 1, caused = 0;
  for (let i = 0; i < iterations; i++) {
    if (isInfected(pos,x,y)) {
      [dx,dy] = turnRight(dx,dy);
      clean(pos,x,y);
    } else {
      [dx,dy] = turnLeft(dx,dy);
      infect(pos,x,y);
      caused++;
    }
    x += dx; y += dy;
  }
  console.log(caused);
}

const INPUT = fs.readFileSync("22.txt", "utf8");
solve(INPUT, 10000);
