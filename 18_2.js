const fs = require('fs');

/*snd X plays a sound with a frequency equal to the value of X.
set X Y sets register X to the value of Y.
add X Y increases register X by the value of Y.
mul X Y sets register X to the result of multiplying the value contained in register X by the value of Y.
mod X Y sets register X to the remainder of dividing the value contained in register X by the value of Y (that is, it sets X to the result of X modulo Y).
rcv X recovers the frequency of the last sound played, but only when the value of X is not zero. (If it is zero, the command does nothing.)
jgz X Y jumps with an offset of the value of Y, but only if the value of X is greater than zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)
*/

val = (y,reg) => isNaN(parseInt(y)) ? reg.get(y) : parseInt(y);

const IL = {};

IL['set'] = (x,y) => (reg) => { reg.set(x, val(y,reg)); reg.ip++; return reg; }
IL['add'] = (x,y) => (reg) => { reg.set(x, reg.get(x) + val(y,reg)); reg.ip++; return reg; }
IL['mul'] = (x,y) => (reg) => { reg.set(x, reg.get(x) * val(y,reg)); reg.ip++; return reg; }
IL['mod'] = (x,y) => (reg) => { reg.set(x, reg.get(x) % val(y,reg)); reg.ip++; return reg; }
IL['jgz'] = (x,y) => (reg) => { reg.ip += (val(x,reg) > 0 ? val(y,reg) : 1); return reg; }
IL['snd'] = (x,_) => (reg) => { reg.sndc++; reg.snd.push(val(x,reg)); reg.ip++; return reg; }
IL['rcv'] = (x,_) => (reg) => { 
  if (reg.rcv.length == 0) { reg.block = true;
  } else {
    reg.block = false;
    reg.set(x, reg.rcv.shift());
    reg.ip++; 
  }
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
  return {fun: IL[r[1]](r[2],r[3]), regs: regs(r[2],r[3])};
}

let setupReg = (reg, send, receive, p) => {
  let r = new Map(reg);
  r.ip       = 0;
  r.snd      = send;
  r.rcv      = receive;
  r.sndc     = 0;
  r.block    = false;
  r.id       = p;
  r.set('p', p);
  return r;
}

let solve = (input) => {
  let reg = new Map, reg0 = new Map, reg1 = new Map;
  let buf0 = [], buf1 = [];

  let instructions = input.split("\n").map((l) => {
    let {fun, regs} = parse(l);
    regs.forEach((r) => reg.set(r,0));
    return fun;
  });

  reg0 = setupReg(reg, buf1, buf0, 0);
  reg1 = setupReg(reg, buf0, buf1, 1);

  while (true) {
    instructions[reg0.ip](reg0);
    instructions[reg1.ip](reg1);

    if (reg0.block && reg1.block) break;
  }
  console.log(reg1.sndc);
}

const INPUT = fs.readFileSync("18.txt", "utf8");
solve(INPUT);
