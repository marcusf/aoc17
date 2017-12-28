with(Math){c=ceil,f=floor,s=sqrt,p=pow,a=abs,l=log2}


const U = -1, L = -1, D = 1, R = 1, N = 0;

const leftEmpty = (m,x,y,dx,dy) => 0 == m[y+(dy==N?dx==R?U:D:N)][x+(dx==N?dy==D?R:L:N)];
const turn = (dx,dy) => [dy==U?L:dy==D?R:N, dx==R?U:dx==L?D:N];
const sqsum = (m,x,y) => m[y][x+1]   + m[y][x-1]   + m[y+1][x]   + m[y-1][x] 
                       + m[y+1][x+1] + m[y-1][x-1] + m[y-1][x+1] + m[y+1][x-1];

const solve1 = n => { q=c(s(n)),r=q+q%2-1,u=p(r-2,2),w=r-1;
  return f(r/2)+a(n-u-f((n-u)/w)*w-c(w/2)) }

const solve2 = n => {
  let r = 2 + c(l(s(n))), y = c(r / 2), x = y-1, dx = 1, dy = 0;
  let m = Array(r).fill(0).map(x => Array(r).fill(0));
  m[y][x] = 1;

  while (true) {
    x += dx; y += dy;
    m[y][x] = sqsum(m,x,y);
    if (m[y][x]>n) return m[y][x];
    if (leftEmpty(m,x,y,dx,dy)) [dx,dy] = turn(dx,dy);
  }
}

console.log(solve1(312051));
console.log(solve2(312051));
