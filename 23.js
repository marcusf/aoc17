const fs = require('fs');

val = (y,reg) => isNaN(parseInt(y)) ? reg.get(y) : parseInt(y);

const IL = {};

IL['set'] = (x,y) => (reg) => { reg.set(x, val(y,reg)); reg.ip++; return reg; }
IL['sub'] = (x,y) => (reg) => { reg.set(x, reg.get(x) - val(y,reg)); reg.ip++; return reg; }
IL['mul'] = (x,y) => (reg) => { reg.set(x, reg.get(x) * val(y,reg)); reg.mulc++; reg.ip++; return reg; }
IL['jnz'] = (x,y) => (reg) => { reg.ip += (val(x,reg) != 0 ? val(y,reg) : 1); return reg; }

regs = (x,y) => { 
  let r = []; 
  if (x != undefined && isNaN(parseInt(x))) r.push(x); 
  if (y != undefined && isNaN(parseInt(y))) r.push(y); 
  return r;
}

let parse = (str) => {
  let r = /([a-z]+) ([a-z]|(?:-?\d+))(?:\s([a-z]|(?:-?\d+)))?/.exec(str);
  return {fun: IL[r[1]](r[2],r[3]), regs: regs(r[2],r[3])};
}

let setupReg = (reg, a) => {
  let r = new Map(reg);
  r.ip       = 0;
  r.sndc     = 0;
  r.block    = false;
  r.mulc     = 0;
  r.set('a', 1);
  return r;
}

let solve = (input) => {
  let reg = new Map;

  let instructions = input.split("\n").map((l) => {
    let {fun, regs} = parse(l);
    regs.forEach((r) => reg.set(r,0));
    return fun;
  });

  reg = setupReg(reg, 0);
  while (reg.ip < instructions.length) {
    console.log('*', reg.ip, 'a =', reg.get('a'), 'b =',  reg.get('b'), 'c =', reg.get('c'), 
      'd =', reg.get('d'), 'e =', reg.get('e'), 'f =', reg.get('f'), 
      'g =', reg.get('g'), 'h =', reg.get('h'));
    instructions[reg.ip](reg);
    //console.log(reg.ip, reg.get('h'));
  }
  console.log(reg.mulc);
}

const INPUT = fs.readFileSync("23.txt", "utf8");
solve(INPUT);
