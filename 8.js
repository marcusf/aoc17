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
                      : (l) => { throw('Unknown instruction ' + op) };

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
  for ([_, val] of regs) {
    if (val > regs.get('__max')) regs.set('__max', val);
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
  regs.set('__max', 0);
  code.reduce((regs,loc) => exec(loc, regs), regs);
  let max = 0;
  for ([k, val] of regs) {
    if (val > max && k != '__max') max = val;
  }
  return {max: max, total_max: regs.get('__max')};
}

const INPUT = fs.readFileSync("8.txt", "utf8");
let {max, total_max} = solve(INPUT);
console.log('max:', max, 'total:', total_max);
