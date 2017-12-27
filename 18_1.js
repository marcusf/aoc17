const fs = require('fs');

/*snd X plays a sound with a frequency equal to the value of X.
set X Y sets register X to the value of Y.
add X Y increases register X by the value of Y.
mul X Y sets register X to the result of multiplying the value contained in register X by the value of Y.
mod X Y sets register X to the remainder of dividing the value contained in register X by the value of Y (that is, it sets X to the result of X modulo Y).
rcv X recovers the frequency of the last sound played, but only when the value of X is not zero. (If it is zero, the command does nothing.)
jgz X Y jumps with an offset of the value of Y, but only if the value of X is greater than zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)
*/

val = (y,reg) => isNaN(parseInt(y)) ? reg[y] : parseInt(y);
const instr = {}
instr['set'] = (x,y) => (reg) => { reg[x]  = val(y,reg); reg['_IP']++; return reg; }
instr['add'] = (x,y) => (reg) => { reg[x] += val(y,reg); reg['_IP']++; return reg; }
instr['mul'] = (x,y) => (reg) => { reg[x] *= val(y,reg); reg['_IP']++; return reg; }
instr['mod'] = (x,y) => (reg) => { reg[x] %= val(y,reg); reg['_IP']++; return reg; }

instr['jgz'] = (x,y) => (reg) => {
  if (reg[x] > 0) {
    reg['_IP'] += val(y,reg);
  } else {
    reg['_IP']++; 
  }
  return reg;
}
instr['snd'] = (x,_)   => (reg) => { reg['_PLAYING'] = reg[x]; reg['_IP']++; return reg; }
instr['rcv'] = (x,_)   => (reg) => { 
  if (reg[x] > 0) console.log(reg['_PLAYING']);
  reg['_IP']++; 
  return reg; 
}

regs = (x,y) => { 
  let r = []; 
  if (x != undefined && isNaN(parseInt(x))) r.push(x); 
  if (y != undefined && isNaN(parseInt(y))) r.push(y); 
  return r;
}

let parse = (str) => {
  let r = /([a-z]+) ([a-z]|(?:-?\d+))(?:\s([a-z]|(?:-?\d+)))?/.exec(str);
  return {fun: instr[r[1]](r[2],r[3]), regs: regs(r[2],r[3])};
}

let solve = (input) => {
  let reg = new Map;
  let instructions = input.split("\n").map((l) => {
    let {fun, regs} = parse(l);
    regs.forEach((r) => { if (!reg.has(r)) reg.set(r,0) });
    return fun;
  });
  reg['_IP'] = 0;
  reg['_PLAYING'] = 0;
  while (true) {
    instructions[reg['_IP']](reg);
  }
}

const INPUT = fs.readFileSync("18.txt", "utf8");
solve(INPUT);
