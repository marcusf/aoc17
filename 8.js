const fs = require('fs');

const comp = (op, r) => op == '==' ? (l) => (l == r)
                      : op == '>=' ? (l) => (l >= r)
                      : op == '<=' ? (l) => (l <= r)
                      : op == '!=' ? (l) => (l != r)
                      : op ==  '<' ? (l) => (l  < r)
                      : op ==  '>' ? (l) => (l  > r)
                      : (l) => { throw('Unknown operator ' + op) }; 

const incr = (op, v) => op == 'inc' ? (l) => (l + v)
                      : op == 'dec' ? (l) => (l - v)
                      : (l) => { throw('Unknown instruction ' + op )};

// liq inc 589 if vv == -2599
const makeInstr = (string) => {
  const PARSE = /([a-z]+) (inc|dec) (-?\d+) if ([a-z]+) (==|>=|<=|!=|<|>) (-?\d+)/;
  let s = PARSE.exec(string);
  return { reg: s[1], inc: incr(s[2], parseInt(s[3])),
           by: parseInt(s[3]), comp: comp(s[5],s[6]), comp_reg: s[4], comp_val: s[6] }
}

const exec = (loc, regs) => {
  if (loc.comp(regs.get(loc.comp_reg))) {
    regs.set(loc.reg, loc.inc(regs.get(loc.reg)));
  }
  return regs;
}

const solve = (input) => {
  let code = input.split("\n").map((l) => makeInstr(l));
  let regs = code.reduce((acc, loc) => {
    acc.set(loc.reg, 0);
    acc.set(loc.comp_reg, 0);
    return acc;
  }, new Map);
  code.reduce((regs,loc) => exec(loc, regs), regs);
  let max = 0;
  for ([_, val] of regs) {
    if (val > max) max = val;
  }
  return max;
}

const INPUT = fs.readFileSync("8.txt", "utf8");
console.log("Solve: ", solve(INPUT));
