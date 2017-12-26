var knot = require('./knot');

var INPUT = 'stpzcrnm';

let toBinary = (hex) => {
  let output = '';
  for (var i = 0; i < hex.length; i+=2) {
    output += parseInt(hex.slice(i,i+2), 16).toString(2)
  }
  return output;
}

let solve1 = (input) => {
  let disk = [];
  for (let i = 0; i < 128; i++) {
    disk.push(toBinary(knot.hash(input + '-' + i)));
  }
  console.log(disk.reduce((a,l) => a + l.split('').reduce((s,c) => s + (c == '1' ? 1 : 0), 0), 0));
}

solve1(INPUT);
