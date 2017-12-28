const fs = require('fs');

const hash = (x,y) => x + ',' + y;

const CLEAN = '.', WEAKENED = 'W', INFECTED = '#', FLAGGED = 'F';

const parse = (input) => {
  let lines = input.split("\n");
  let cords = lines.reduce((l,row,y) => l.concat(
    row.split('').reduce((l,col,x) => { if (col == '#') l.push({x:x,y:y}); return l; }, [])),[]);
  let yMid = Math.floor(lines.length / 2), xMid = Math.floor(lines[0].length / 2);
  cords = new Map(cords.map((c) => [hash(c.x-xMid, -1*(c.y-yMid)), INFECTED]));
  return cords;
}

const isInfected = (set, x, y) => set.has(hash(x,y));
const infect     = (set, x, y) => set.add(hash(x,y));
const clean      = (set, x, y) => set.delete(hash(x,y));

const getState = (map, x, y) => map.has(hash(x,y)) ? map.get(hash(x,y)) : CLEAN;
const transitionState = (map, x, y) => {
  let h = hash(x,y), ns = -1;
  if (!map.has(h)) {
    map.set(h, WEAKENED); ns = WEAKENED;
  }
  else {
    let state = map.get(h);
    if (state == WEAKENED) { map.set(h, INFECTED); ns = INFECTED; }
    else if (state == INFECTED) { map.set(h, FLAGGED); ns = FLAGGED; }
    else if (state == FLAGGED) { map.delete(h); ns = CLEAN; }
  }
  return ns;
}

const turnRight = (dx,dy) => dx == 0 ? (dy == 1 ? [1, 0] : dy == -1 ? [-1,0] : [])
                          :  dy == 0 ? (dx == 1 ? [0,-1] : dx == -1 ? [ 0,1] : []) : [];
const turnLeft  = (dx,dy) => dx == 0 ? (dy == 1 ? [-1,0] : dy == -1 ? [ 1,0] : [])
                          :  dy == 0 ? (dx == 1 ? [0, 1] : dx == -1 ? [0,-1] : []) : [];
const flipAround = (dx,dy)=> [-1*dx,-1*dy];

const solve = (input, iterations) => {
  let pos = parse(input);
  let x = 0, y = 0, dx = 0, dy = 1, caused = 0;
  for (let i = 0; i < iterations; i++) {
    let state = getState(pos, x, y);
    [dx,dy] = state == CLEAN    ? turnLeft(dx,dy) 
            : state == INFECTED ? turnRight(dx,dy)
            : state == FLAGGED  ? flipAround(dx,dy)
            : [dx,dy];
    state = transitionState(pos, x, y); 
    if (state == INFECTED) caused++;
    x += dx; y += dy;
  }
  console.log(caused);
}

const INPUT = fs.readFileSync("22.txt", "utf8");
solve(INPUT, 10000000);
