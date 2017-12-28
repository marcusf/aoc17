const fs = require('fs');

const comp = (op, r) => op == '==' ? l => l == r : op == '>=' ? l => l >= r
                      : op == '<=' ? l => l <= r : op == '!=' ? l => l != r
                      : op ==  '<' ? l => l  < r : op ==  '>' ? l => l  > r : 0;
const incr = (op, v) => op == 'inc'? l => l  + v : op == 'dec'? l => l  - v : 0;

// liq inc 589 if vv == -2599
const parse = string => {
  let s = /(\w+) (\w+) (-?\d+) if (\w+) ([<>!=]+) (-?\d+)/.exec(string);
  return { reg: s[1], inc: incr(s[2], +s[3]), by: +s[3], 
           comp: comp(s[5],s[6]), comp_reg: s[4], comp_val: +s[6] }
}

const exec = (loc, regs) => {
  if (loc.comp(regs.get(loc.comp_reg))) regs.set(loc.reg, loc.inc(regs.get(loc.reg)));
  for ([_, val] of regs) if (val > regs.get('max')) regs.set('max', val);
  return regs;
}

const solve = input => {
  let code = input.split("\n").map(l => parse(l));
  let regs = code.reduce((m, l) => m.set('max',0).set(l.reg, 0).set(l.comp_reg, 0), new Map);
  code.reduce((regs,loc) => exec(loc, regs), regs);
  let max = Array.from(regs.entries()).reduce((m,[k,v]) => v>m&&k!='max' ? v : m, 0);
  return {max: max, total: regs.get('max')};
}

console.log(solve(fs.readFileSync("8.txt", "utf8")));
