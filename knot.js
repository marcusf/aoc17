/** Extraction of Knot Hash from 10.js for 14.js */

const knotReverse = (data, from, length) => {
  for (let i = 0; i < length/2; i++) {
    let start = (from + i) % data.length;
    let end = (from+length-1-i) % data.length;
    let s = data[start];
    data[start] = data[end];
    data[end] = s;
  }
  return data;
}

const knotOnce = (data, hash, skip, position) => {
  let hashed = hash.reduce((data, key) => {
    data = knotReverse(data, position, key);
    position = (position + skip + key);
    skip++;
    return data;
  }, data);
  return {data: data, skip: skip, position: position}
}

const hash = (input) => {
  const SUFFIX = [17, 31, 73, 47, 23];
  let data = Array.apply(null, Array(256)).map((_,n)=>n);
  let output = [];
  let hash = input.split('').map(c=>c.charCodeAt(0));
  hash = hash.concat(SUFFIX);
  let skip = 0, position = 0;
  for (let i = 0; i < 64; i++) {
    ({data, skip, position} = knotOnce(data, hash, skip, position));
  }
  for (let i = 0; i < 16; i++) {
    output.push(data.slice(i*16,i*16+16).reduce((a,l) => a ^ l, 0));
  }
  return output.map((n) => (n < 16 ? '0':'')+ n.toString(16)).join('');
}

exports.hash = hash;
