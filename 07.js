const fs = require('fs');

const mkNode = (name, weight, children) => ({name: name, weight: weight, children: children})

const buildNodeSet = (input) => {
  const MATCH = /([a-z]+) \((\d+)\)( -> (.+))*/;
  // Parse all entries
  return input.split('\n').reduce((acc, line) => {
    let r = MATCH.exec(line);
    acc.set(r[1], mkNode(r[1], parseInt(r[2]), r[4] == undefined ? [] : r[4].split(', ')));
    return acc;
  }, new Map);
}

const buildTree = (rootNode, nodeset) => {
  const build = (child) => {
    let node = mkNode(child, nodeset.get(child).weight, []);
    for (child of nodeset.get(child).children) {
      node.children.push(build(child));
    }
    return node;
  }
  const addWeight = (node) => {
    node.totalWeight = node.weight + node.children.reduce((sum,node) => sum+addWeight(node), 0);
    return node.totalWeight;
  }
  let tree = build(rootNode);
  addWeight(tree);
  return tree;
}

const findRootNode = (nodeMap) => {
  let reverse = new Map;
  for (let [key, {name, weight, children}] of nodeMap) {
    if (!reverse.has(key)) reverse.set(key, null);
    children.forEach((child) => { reverse.set(child, name) })
  }
  for ([key,val] of reverse) {
    if (val == null) return key;
  }
}

const partitionByWeight = (nodes) => {
  let partition = new Map, result = { wrong: null, rest: [] };
  for (node of nodes) {
    if (!partition.has(node.totalWeight)) {
      partition.set(node.totalWeight, []);
    }
    partition.get(node.totalWeight).push(node);
  }
  for ([key,val] of partition) {
    if (val.length == 1) {
      result.wrong = val[0];
    } else {
      result.rest = val;
    }
  }
  return result;
}

const findBadNode = (parent, node) => {
  let wrong = partitionByWeight(node.children).wrong;
  if (wrong == null) {
    let sets = partitionByWeight(parent.children);
    let rightWeight = sets.rest[0].totalWeight;
    return { node: node, rightWeight: rightWeight };
  } else {
    return findBadNode(node, wrong);
  }
}

const solve = (input) => {
  let nodes = buildNodeSet(input);
  let rootNode = findRootNode(nodes);

  // Solves part #1
  console.log("Root node is", rootNode);
  
  // Solves part #2
  let tree = buildTree(rootNode, nodes);
  let {node, rightWeight} = findBadNode(tree, tree);

  console.log(node.name, "has total weight", node.totalWeight, "- It should be", rightWeight);
  console.log("Set", node.name, "weight to", node.weight + (rightWeight-node.totalWeight),
    "instead of", node.weight);
}

const INPUT = fs.readFileSync("7.txt", "utf8");
solve(INPUT);