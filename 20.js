const fs = require('fs');

const vec = (x,y,z) => ({ x: parseInt(x), y: parseInt(y), z: parseInt(z) });

const parse = (line,n) => {
  const exp = /p=<(-?\d+),(-?\d+),(-?\d+)>, v=<(-?\d+),(-?\d+),(-?\d+)>, a=<(-?\d+),(-?\d+),(-?\d+)>/;
  let r = exp.exec(line);
  return {id: n, p: vec(r[1],r[2],r[3]), v: vec(r[4],r[5],r[6]), a: vec(r[7],r[8],r[9])};
}

const updateVec = (vec) => {
  vec.v.x += vec.a.x; vec.v.y += vec.a.y; vec.v.z += vec.a.z;
  vec.p.x += vec.v.x; vec.p.y += vec.v.y; vec.p.z += vec.v.z;
  return vec;
}

const dist = (vec) => Math.abs(vec.p.x) + Math.abs(vec.p.y) + Math.abs(vec.p.z)
const compare = (a, b) => dist(a)-dist(b);
const hashVecs = (vec) => vec.map((v) => v.id ).join("-")
const hashVec = (vec) => vec.p.x + ',' + vec.p.y + ',' + vec.p.z;


const removeCrashed = (vecs) => {
  let grouped = vecs.reduce((map, vec) => {
    let h = hashVec(vec);
    if (!map.has(h)) {
      map.set(h,[]);
    }
    map.get(h).push(vec.id);
    return map;
  }, new Map);
  return vecs.reduce((arr,vec) => {
    let h = hashVec(vec);
    if (grouped.get(h).length == 1) arr.push(vec);
    return arr;
  }, []);
}

const solve1 = (input) => {
  let vecs = input.split("\n").map((line,i) => parse(line,i));
  let hashes = new Set;
  while (true) {
    vecs.map(updateVec);
    vecs = vecs.sort(compare);
    let hash = hashVecs(vecs);
    if (hashes.has(hash)) {
      break;
    } else {
      hashes.add(hash);
    }
  }
  console.log(vecs[0].id);
}

const solve2 = (input) => {
  let vecs = input.split("\n").map((line,i) => parse(line,i));
  let hashes = new Set;
  console.log(vecs.length);
  while (true) {
    vecs.map(updateVec);
    vecs = vecs.sort(compare);
    vecs = removeCrashed(vecs);
    let hash = hashVecs(vecs);
    if (hashes.has(hash)) {
      break;
    } else {
      hashes.add(hash);
    }
  }
  console.log(vecs.length);
}

const INPUT = fs.readFileSync("20.txt", "utf8");
solve2(INPUT);
