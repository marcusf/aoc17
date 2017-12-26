const knot = require('./knot');
const glib = require('./graph');

let toBinary = (hex) => {
  let output = '';
  for (var i = 0; i < hex.length; i+=2) {
    let bin = parseInt(hex.slice(i,i+2), 16).toString(2);
    output += '0'.repeat(8-bin.length) + bin;
  }
  return output;
}

let keyFrom = (x,y) => x + '-' + y;
let surroundings = (x,y,disk) => {
  let out = [], h = 128, w = 128;
  if (x-1 >= 0 && disk[y][x-1] == 1) out.push(keyFrom(x-1,y));
  if (x+1 < w  && disk[y][x+1] == 1) out.push(keyFrom(x+1,y));
  if (y-1 >= 0 && disk[y-1][x] == 1) out.push(keyFrom(x,y-1));
  if (y+1 < h  && disk[y+1][x] == 1) out.push(keyFrom(x,y+1));
  return out;
}

let buildGraph = (disk) => {
  let graph = new Map, h = disk.length, w = disk[0].length;
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      if (disk[y][x] == 1) {
        let key = keyFrom(x, y), around = surroundings(x, y, disk);
        glib.connect(graph, key, around);
      }
    }
  }
  return graph;
}

let solve1 = (input) => {
  let disk = [];
  for (let i = 0; i < 128; i++) {
    disk.push(toBinary(knot.hash(input+'-'+i)));
  }
  console.log(disk.reduce((a,l) => a + l.split('').reduce(
    (s,c) => s + (c == '1' ? 1 : 0), 0), 0));
}

let solve2 = (input) => {
  let disk = [];
  for (let i = 0; i < 128; i++) {
    disk.push(toBinary(knot.hash(input+'-'+i)).split('').map((v) => parseInt(v)));
  }
  let graph = buildGraph(disk);
  console.log(glib.countCCs(graph));
}

let INPUT = 'stpzcrnm';

solve1(INPUT);
solve2(INPUT);