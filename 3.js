// Solver to first one
function solvePart1() {
with(Math){c=ceil,f=floor,s=sqrt,p=pow,a=abs}
solve=(n)=>{q=c(s(n)),r=q+q%2-1,u=p(r-2,2),w=r-1;return f(r/2)+a(n-u-f((n-u)/w)*w-c(w/2))}
console.log(solve(312051))
}


let pretty = (matrix, width=3) => {
  return matrix.map((row) => { return row.map((v) => { 
      return (" ".repeat(width-v.toString().length)) + v.toString() 
    }).join(" "); 
  }).join("\n");
}

const UP = -1, LEFT = -1, DOWN = 1, RIGHT = 1, NONE = 0;

let leftBlockIsNonZero = (matrix, x, y, dx, dy) => {
  let lx = x + (dx == NONE ? (dy == DOWN ? RIGHT : LEFT) : NONE),
      ly = y + (dy == NONE ? (dx == RIGHT ? UP : DOWN) : NONE);
  return 0 != matrix[ly][lx];
}

let turn = (dx, dy) => ({ dx: dy == UP ? LEFT : (dy == DOWN ? RIGHT : NONE), 
                          dy: dx == RIGHT ? UP : (dx == LEFT ? DOWN : NONE)});

let sumAround = (m, x, y) => m[y][x+1]   + m[y][x-1]   + m[y+1][x]   + m[y-1][x] 
                           + m[y+1][x+1] + m[y-1][x-1] + m[y-1][x+1] + m[y+1][x-1];

let solve = (n) => {
  let radius = 2 + Math.ceil(Math.log2(Math.sqrt(n)));
  let matrix = Array(radius).fill(0).map(x => Array(radius).fill(0));
  let y = Math.ceil(radius / 2), x = y-1, dx = 1, dy = 0, answer = 0;

  matrix[y][x] = 1;

  while (true) {
    x += dx; 
    y += dy;
    matrix[y][x] = sumAround(matrix, x, y);
    if (matrix[y][x] > n) {
      answer = matrix[y][x];
      break;
    } else if (!leftBlockIsNonZero(matrix, x, y, dx, dy)) {
      ({dx, dy} = turn(dx,dy));
    }
  }
  return answer;
}


console.log(solve(312051));

//}

//solvePart2();