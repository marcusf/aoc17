const STEP = 356;

const insertAt1 = (arr, loc, value) => {
  let pos = loc%(arr.length)+1;
  arr.splice(pos, 0, value);
  return pos;
}

const solve1 = (step, ctr) => {
  let buffer = [0];
  let loc = 0;
  for (let i = 1; i < 2018; i++) {
    loc = loc + step;
    loc = insertAt1(buffer, loc, i);
  }
  console.log(buffer.slice(loc-3,loc+3));
}

solve1(STEP);

















