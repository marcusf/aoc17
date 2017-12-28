const fs = require('fs');

let solve1 = s => s.split("\n").map(l => l.split(' ').map(s=>+s).reduce(([a,b],n) => 
      [n>a?n:a, n<b?n:b],[0,Number.MAX_VALUE]).reduce((a,b,i) => a+Math.pow(-1,i)*b, 0))
      .reduce((a,c) => a+c, 0);

let solve2 = s => s.split("\n").map(l => l.split(' ').map(s=>+s)
     .reduce((a,n,_,as) => as.reduce((b,d)=>(n!=d&&n%d==0)?n/d:b,a),0)).reduce((a,c) => a+c, 0);

console.log(solve1(fs.readFileSync("2.txt", "utf8")));
