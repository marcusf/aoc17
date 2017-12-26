// Extracted from 12.js to help in 14.js

const connect = (graph, node, nodes) => {
  if (!graph.has(node)) {
    graph.set(node,new Set);
  }
  nodes.forEach((n) => graph.get(node).add(n));
  for (let n2 of nodes) {
    if (!graph.has(n2)) {
      graph.set(n2,new Set);
    }
    graph.get(n2).add(node);
  }
}

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

// Counts the strongly connected components
const countCCs = (graph) => {
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
  return groups;
}

exports.connect = connect;
exports.countCCs = countCCs;


