/*
Generator A starts with 634
Generator B starts with 301
*/
const A = 634, B = 301;
const MAGIC = 2147483647, MAGIC_A = 16807, MAGIC_B = 48271;

const generate = (factor) => (prev) => (prev * factor) % MAGIC;
const genA = generate(MAGIC_A)
const genB = generate(MAGIC_B)

const solve1 = (a,b) => {
  let pa = a, pb = b, hits = 0;
  for (let i = 0; i < 40*1000*1000; i++) {
    pa = genA(pa);
    pb = genB(pb);
    if ((pa & 0xFFFF) == (pb & 0xFFFF)) {
      hits++;
    }
  }
  console.log(hits);
}

const solve2 = (a,b) => {
  let pa = a, pb = b, hits = 0, as = [], bs = [];
  const FIVE_MILLION = 5*1000*1000;
  while (as.length < FIVE_MILLION || bs.length < FIVE_MILLION) {
    pa = genA(pa);
    pb = genB(pb);
    if (pa % 4 == 0) as.push(pa);
    if (pb % 8 == 0) bs.push(pb);
  }
  for (i = 0; i < FIVE_MILLION; i++) {
    if ((as[i] & 0xFFFF) == (bs[i] & 0xFFFF)) {
      hits++;
    }
  }
  console.log(hits);
}

solve1(A,B);
solve2(A,B);

