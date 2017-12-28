const fs = require('fs');

/*let INPUT = "0/2\n"+"2/2\n"+"2/3\n"+"3/4\n"+"3/5\n"+"0/1\n"+"10/1\n"+"9/10"; */

const parse = (rows) => rows.split("\n").map(row => row.split("/").map(v => parseInt(v)))
const canConnect = (a,b) => a[0] == b[0] || a[1] == b[0] || a[0] == b[1] || a[1] == b[1];
const same = ([a0,a1],[b0,b1]) => a0 == b0 && a1 == b1;
const startNode = node => node[0] == 0 || node[1] == 0;
let hash = node => node.join(",");
const startNodes = nodeset => nodeset.filter(n => startNode(n));
const buildGraph = ns => ns.reduce((g,n) => 
   { g[n] = ns.filter(c => !same(n,c) && canConnect(n,c)); return g }, {});
const inList = (node, list) => list.reduce((res, n) => same(node, n) || res, false); 

const freePort  = (n, prev) => (n[0] == prev[0] || n[0] == prev[1]) ? n[1]
                            :  (n[1] == prev[0] || n[1] == prev[1]) ? n[0] : 0;

const getCandidates = (path, graph) => {
  let head = path[path.length-1];
  let free = path.length == 1 ? freePort(head, [0,0]) : freePort(head, path[path.length-2]);
  let list = graph[head].filter(n => n[0] == free || n[1] == free).filter(n => !inList(n, path));
  return list;
}

let score = (path) => path.reduce((s,[a,b]) => s+a+b, 0);

const walkPaths = (path, graph, output) => {
  //console.log(path, output);
  let candidates = getCandidates(path, graph);  
  if (candidates.length > 0) {
    candidates.forEach((candidate) => {
      walkPaths(path.concat([candidate]), graph, output);
    });
  } else {
    output.push(path);
  }
}

const pretty = (path) => path.map(n => n[0] + '/' + n[1]).join('--');

const solve = (input) => {
  let nodeset = parse(input);
  let graph = buildGraph(nodeset), start = startNodes(nodeset);
  let paths = [];
  start.forEach((startNode) => walkPaths([startNode], graph, paths));

  // Solve part 1
  let scores = paths.map(path => score(path));
  console.log(scores.reduce((max, s) => s > max ? s : max, 0));

  // Solve part 2
  let sp = paths.sort((p1,p2) => p2.length - p1.length);
  let ml = sp[0].length;
  console.log(Math.max.apply(null, 
    sp.reduce((l,s) => s.length == ml ? l.concat(score(s)) : l, [])));
}

const INPUT = fs.readFileSync("24.txt", "utf8");
solve(INPUT);
