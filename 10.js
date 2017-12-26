const HASH_1 = [76,1,88,148,166,217,130,0,128,254,16,2,130,71,255,229];
const HASH_2 = "76,1,88,148,166,217,130,0,128,254,16,2,130,71,255,229";
const SUFFIX_2 = [17, 31, 73, 47, 23];
const DATA = Array.apply(null, Array(256)).map((_,n)=>n);

const reverse = (data, from, length) => {
  for (let i = 0; i < length/2; i++) {
    let start = (from + i) % data.length;
    let end = (from+length-1-i) % data.length;
    let s = data[start];
    data[start] = data[end];
    data[end] = s;
  }
  return data;
}

const onePass = (data, hash, skip, position) => {
  let hashed = hash.reduce((data, key) => {
    data = reverse(data, position, key);
    position = (position + skip + key);
    skip++;
    return data;
  }, data);
  return {data: data, skip: skip, position: position}
}

const solve2 = (data, hash_str) => {
  let output = [];
  let hash = hash_str.split('').map(c=>c.charCodeAt(0));
  hash = hash.concat(SUFFIX_2);
  let skip = 0, position = 0;
  for (let i = 0; i < 64; i++) {
    ({data, skip, position} = onePass(data, hash, skip, position));
  }
  for (let i = 0; i < 16; i++) {
    output.push(data.slice(i*16,i*16+16).reduce((a,l) => a ^ l, 0));
  }
  return output.map((n) => (n < 16 ? '0':'')+ n.toString(16)).join('');
}

const solve1 = (d, hash) => {
  let {data, _, __} = onePass(d, hash, 0, 0);
  return data[0]*data[1];
}

console.log(solve1(DATA.slice(), HASH_1));
console.log(solve2(DATA.slice(), HASH_2));
