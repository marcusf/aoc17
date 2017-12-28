const fs = require('fs');
const INPUT = fs.readFileSync("9.txt", "utf8");

const Node = (value, parent=null) => ({value: value, parent: parent, children: [] });

const solve = input => {
  let [cleaned, removed] = clean(input);
  let tree = parse(cleaned);
  let sum  = sumTree(tree, 0);
  console.log("The sum is:", sum, "- Removed garbage:", removed);
}

const pretty  = tree => '{' + tree.children.map(pretty).join(',') + '}';
const sumTree = tree => tree.value + tree.children.reduce((s,node) => s+sumTree(node), 0);

/** Not strictly necessary but makes sure it's cleaned appropriately */
const validate = (curr, next) => {
  switch (curr) {
    case '{': return next != ','
    case '}': return next == ',' || next == '{' || next == '}'
    case '_': return next == ',' || next == '}'
    case ',': return next == '_' || next == '{'
    case  '': return true
    default : return false;
  }
}

const parse = input => {
  let tree = Node(1), nodeStack = [tree], chr = '', c = 1;
  for (let i = 1; i < input.length; i++) {
    let prev = chr;
    chr = input[i];
    if (!validate(prev, chr)) return null;
    if (chr == '{') {
      let parent = nodeStack[nodeStack.length-1];
      let node = Node(++c, parent);
      parent.children.push(node);
      nodeStack.push(node);
    } else if (chr == '}') {
      nodeStack.pop();
      c--;
    }
  } 
  return tree;
}

const clean = input => {
  let idx = 0, garbage = false, output = '', cleaned = 0;
  while (idx < input.length) {
    let chr = input[idx];
    if (garbage) {
      switch(chr) {
        case '>': garbage = false; idx++; break;
        case '!': idx += 2; break;
        default: cleaned++; idx++; break;
      }
    } else {
      if (chr == '<') {
        garbage = true;
        output += '_'
      } else {
        output += chr;
      }
      idx++;
    }
  }
  return [output, cleaned];
}

solve(INPUT);
