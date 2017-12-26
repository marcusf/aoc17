const fs = require('fs');

const connect = (map, node, nodes) => {
  if (!map.has(node)) {
    map.set(node,new Set);
  }
  nodes.forEach((n) => map.get(node).add(n));
  for (let n2 of nodes) {
    if (!map.has(n2)) {
      map.set(n2,new Set);
    }
    map.get(n2).add(node);
  }
}

const makeGraph = (input) => 
  input.split("\n").reduce((map, line) => {
    let r = /(\d+) <-> (.+)$/.exec(line);
    connect(map, r[1], r[2].split(", "));
    return map;
  }, new Map);

const findOneGroup = (graph, start) => {
  let visitedNodes = new Set, next = [start];
  do {
    let currentNode = next.pop();
    visitedNodes.add(currentNode);
    let candidates = graph.get(currentNode);
    for (candidate of candidates) {
      if (!visitedNodes.has(candidate)) {
        next.push(candidate);
      }
    }
  } while (next.length > 0);
  return visitedNodes;
}

const solve1 = (input) => {
  let graph = makeGraph(input);
  let visitedNodes = findOneGroup(graph, '0');
  console.log(visitedNodes.size);
}

const solve2 = (input) => {
  let graph = makeGraph(input);
  let allNodes = []; 
  for (let key of graph.keys()) {
    allNodes.push(key);
  }
  let groups = 0;
  while (allNodes.length > 0) {
    let startNode = allNodes[0];
    let visitedNodes = findOneGroup(graph, startNode);
    groups++;
    allNodes = allNodes.reduce((list, val) => {
      if (!visitedNodes.has(val)) list.push(val);
      return list;
    }, []);
  }
  console.log(groups);
}

const INPUT = fs.readFileSync("12.txt", "utf8");
solve1(INPUT);
solve2(INPUT);
