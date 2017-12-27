const fs = require('fs');


const deserialise = (input) => input.split('/').map((c)=>c.split(''));
const reverse = (input) => input.reduce((l,b) => { l.unshift(b); return l; },[]);
const flipH = (input) => input.map((s) => reverse(s)); 
const flipV = (input) => reverse(input);
const transpose = (input) => input[0].map((col, i) => input.map(row => row[i]));
const rot90 = (input) => flipH(transpose(input));
const rot180 = (input) => rot90(rot90(input));
const rot270 = (input) => rot90(rot180(input));
const vrot90 = (input) => flipV(rot90(input));
const ident = (input) => input
const permute = (input) => [ident,transpose,rot90,rot180,rot270,flipH,flipV,vrot90]
                              .map((f) => reserialise(f(input)));
const reserialise = (data) => data.map((l)=>l.join('')).join("/");
const ruleFrom = (input, map) => permute(input).reduce((s, v) => map.has(v) ? map.get(v) : s, 'O');

const pretty = (data) => data.map((l)=>l.join('')).join("\n");

const cut = (map,x,y,w,h) => {
  let output = [];
  for (var yy = y; yy<y+h;yy++) {
    let row = [];
    for (var xx = x; xx<x+w;xx++) {
      row.push(map[yy][xx]);
    }
    output.push(row);
  }
  return output;
}

const split = (m, k) => {
  let output = [];
  let w = k;
  for (let y = 0; y < m.length; y+= w) {
    for (let x = 0; x < m[0].length; x+= w) {
      output.push(cut(m,x,y,w,w));
    }
  }
  return output;
}

const createLines = (arrays) => {
  let height = arrays[0].length;
  let output = [];
  for (i = 0; i < height; i++) {
    output.push(arrays.reduce((a,arr) => a.concat(arr[i]),[]));
  }
  return output;
}

const merge = (arrays, width) => {
  let height = arrays[0].length;
  let output = [];
  for (let x = 0; x < arrays.length; x+=width) {
    let o = [];
    for (let l = 0; l < width; l++) {
      o.push(arrays[x+l]);
    }
    output = output.concat(createLines(o));
  }
  return output;
}

const oneStep = (painting, rules) => {
  if (painting.length == 2 || painting.length == 3) {
    return deserialise(ruleFrom(painting,rules));
  } else if (painting.length % 2 == 0) {
    let p = split(painting, 2).map((p) => oneStep(p, rules));
    p = merge(p, painting.length/2);
    return p;
  } else if (painting.length % 3 == 0) {
    let p = split(painting, 3).map((p) => oneStep(p, rules));
    p = merge(p, painting.length/3);
    return p;
  }
}

const count = (string) => {
  let c = 0;
  for (i = 0; i < string.length; i++) {
    if (string[i] == '#') c++;
  }
  return c;
}

const solve = (input, data, steps) => {
  let rules = new Map(input.split("\n").map((v) => v.split(" => ")));
  let painting = deserialise(data);
  for (var i = 0; i < steps; i++) {
    painting = oneStep(painting, rules);
  }
  console.log(painting.reduce((c, row) => c+count(row), 0));
}

const START = ".#./..#/###";
const INPUT = fs.readFileSync("21.txt", "utf8");
solve(INPUT, START, 18); // Change to 5 for solution 1
