const fs = require('fs');

const Node = (name, weight, children) => ({name: name, weight: weight, children: children})

const buildNodeSet = input => {
  return input.split('\n').reduce((map, line) => {
    let r = /([a-z]+) \((\d+)\)( -> (.+))*/.exec(line);
    return map.set(r[1], Node(r[1], +r[2], !r[4]?[]:r[4].split(', ')));
  }, new Map);
}

const buildTree = (root, nodes) => {
  const build = child => {
    let node = Node(child, nodes.get(child).weight, []);
    nodes.get(child).children.map(gc => node.children.push(build(gc)));
    return node;
  }
  const weight = node => 
    node.totalWeight = node.weight + node.children.reduce((s,node) => s+weight(node), 0);
  
  let tree = build(root);
  weight(tree);
  return tree;
}

const findRootNode = (nodeMap) => {
  let reverse = new Map;
  for (let [key, {name, weight, children}] of nodeMap) {
    if (!reverse.has(key)) reverse.set(key, null);
    children.forEach(child => { reverse.set(child, name) })
  }
  for ([key,val] of reverse) if (!val) return key;
}

const partition = nodes => {
  let p = new Map, result = { wrong: [], rest: [] };
  for (node of nodes) p.set(node.totalWeight, [...p.get(node.totalWeight)||[],node]);
  for ([key,val] of p) result[val.length == 1 ? 'wrong' : 'rest'] = val;
  return result;
}

const findBadNode = (parent, node) => {
  let wrong = partition(node.children).wrong;
  if (wrong.length == 0) {
    let sets = partition(parent.children);
    let rightWeight = sets.rest[0].totalWeight;
    return node.weight + (rightWeight-node.totalWeight);
  } else {
    return findBadNode(node, wrong[0]);
  }
}

const solve = input => {
  let nodes = buildNodeSet(input), rootNode = findRootNode(nodes), tree = buildTree(rootNode, nodes);
  console.log("1: Root node is", rootNode);
  console.log("2: Rebalance to", findBadNode(tree, tree));
}

solve(fs.readFileSync("7.txt", "utf8"));
