const fs = require('fs');

const distance = (a, b) => 
  Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z))

const solve = (input) => {
  let start = {x:0,y:0,z:0}, o = {x:0,y:0,z:0}, moves = {}, maxdist = 0;
  moves['ne'] = (c) => {c.x += 1; c.z -= 1; return c; } 
  moves['nw'] = (c) => {c.x -= 1; c.y += 1; return c; } 
  moves['se'] = (c) => {c.x += 1; c.y -= 1; return c; } 
  moves['sw'] = (c) => {c.x -= 1; c.z += 1; return c; } 
  moves['n']  = (c) => {c.y += 1; c.z -= 1; return c; } 
  moves['s']  = (c) => {c.y -= 1; c.z += 1; return c; }
  let e = input.split(',')
    .reduce((coord,move) => {
      let nc = (moves[move])(coord);
      let dist = distance(nc,o);
      if (dist > maxdist) maxdist = dist;
      return nc;
    }, start);
  console.log("Distance is:", distance(e, o));
  console.log("Max was:", maxdist);
}

const INPUT = fs.readFileSync("11.txt", "utf8");
solve(INPUT);
