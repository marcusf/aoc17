const fs = require('fs');

const TEST =
"     |          \n"+
"     |  +--+    \n"+
"     A  |  C    \n"+
" F---|----E|--+ \n"+
"     |  |  |  D \n"+
"     +B-+  +--+";

let vertchar = (c) => c == '|' || ('A' <= c && c <= 'Z');
let horchar = (c) => c == '-' || ('A' <= c && c <= 'Z');

let turn = (maze, x, y, dx, dy) => {
  const xl = maze[0].length;
  const yl = maze.length;
  if (dx == 0) {
    // check x
    dy = 0;
    dx = 0;
    if (x+1 < xl && horchar(maze[y][x+1])) { dx = 1; }
    else if (x-1 >= 0 && horchar(maze[y][x-1])) { dx = -1; }
  } else if (dy == 0) {
    dy = 0;
    dx = 0;
    if (y+1 < yl && vertchar(maze[y+1][x])) { dy = 1; }
    else if (y-1 >= 0 && vertchar(maze[y-1][x])) { dy = -1; }
  }
  return {dx: dx, dy: dy};
}

let solve = (input) => {
  maze = input.split("\n").map((l) => l.split(''));
  let y = 0;
  let x = maze[0].reduce((n,c,i) => c == '|' ? i : n, 0);
  let dx = 0, dy = 1;
  let trail = [];
  while (true) {
    x += dx;
    y += dy;
    let char = maze[y][x];
    if ('A' <= char && char <= 'Z') {
      trail.push(char);
    } else if (char == '+') {
      ({dx,dy} = turn(maze,x,y,dx,dy));
    } else if (char == ' ') {
      break;
    }
  }
  console.log(trail.join(""));
}

const INPUT = fs.readFileSync("19.txt", "utf8");
solve(INPUT);