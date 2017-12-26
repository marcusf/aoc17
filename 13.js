const fs = require('fs');

const parseFirewall = (input) => {
  let firewall = Array.apply(null, Array(1000)).map((_)=>-1);
  let highest = 0;
  input.split("\n").reduce((fw, data) => {
    let pair = data.split(": ").map((v) => parseInt(v));
    firewall[pair[0]] = pair[1];
    highest = pair[0];
  }, firewall);
  return firewall.slice(0, highest+1);
}

const wrap = (num, max) => {
  if (num == -1) return num;
  let pos = num % (2*(max-1));
  if (pos > (max-1)) { pos = (max-1)*2-pos; }
  return pos;
}

const solve = (bounds, state, wait, breakOnHit=false) => {
  let pos = -1, severity = 0;
  while (pos < state.length) {
    if (wait != 0) {
      state = state.map((m,i) => bounds[i] == -1 ? -1 : wait);
      wait = 0; 
    } else {
      pos++;
      if (bounds[pos] != -1 && wrap(state[pos], bounds[pos]) == 0) {
        severity += pos*bounds[pos];
        if (breakOnHit) return Math.max(pos,1);
      }
    }
    state = state.map((m,i) => bounds[i] == -1 ? -1 : m+1);
  }
  return severity;
}

const solve1 = (input) => {
  let depths = parseFirewall(input);
  let firewall = depths.slice().map((v) => v == -1 ? -1 : 0);
  let directions = depths.slice().map((v) => v == -1 ? -1 : 1);
  console.log(solve(depths, firewall, 0));
}

const solve2 = (input) => {
  let severity = 1, tries = 0;
  let wait = tries-1;
  let depths = parseFirewall(input);
  let firewall = depths.slice().map((v) => v == -1 ? -1 : 0);
  do {
    tries += 1;
    wait += 1;
    severity = solve(depths, firewall.slice(), wait, true);
  } while (severity > 0)
  console.log(tries);
}

const INPUT = fs.readFileSync("13.txt", "utf8");

solve1(INPUT);
solve2(INPUT);





















