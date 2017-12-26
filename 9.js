const fs = require('fs');
const INPUT = fs.readFileSync("9.txt", "utf8");

const makeNode = (value, parent) => ({value: value, parent: parent, children: [] });

const solve = (input) => {
  let {cleaned, removed} = clean(input);
  let tree    = parse(cleaned);
  let sum     = sumTree(tree, 0);
  console.log("The sum is:", sum);
  console.log("Removed garbage:", removed);
}

const pretty = (tree) => {
  return '{' + tree.children.map(pretty).join(',') + '}';
}

const sumTree = (tree) => {
  return tree.value + tree.children.reduce((acc,node) => acc+sumTree(node), 0);
}

const validate = (curr, next) => {
  if (curr == '{') { return next != ',';
  } else if (curr == '}') { return next == ',' || next == '{' || next == '}'
  } else if (curr == '_') { return next == ',' || next == '}'
  } else if (curr == ',') { return next == '_' || next == '{'
  } else if (curr == '')  { return true
  } else { return false;
  }
}

const parse = (input) => {
  let idx = 1, tree = makeNode(1, null), prev = '', chr = '', nodeStack = [], c = 1;
  nodeStack.push(tree);
  do {
    let parent = nodeStack[nodeStack.length-1];
    prev = chr;
    chr =  input[idx++];
    if (!validate(prev, chr)) throw('Error in parsing! ' + prev + ' ::: ' + chr);

    if (chr == '{') {
      let node = makeNode(++c, parent);
      parent.children.push(node);
      nodeStack.push(node);
    } else if (chr == '}') {
      nodeStack.pop();
      c--;
    } else if (chr == ',') {
    } else if (chr == '_') {
    }
  } while (idx < input.length);
  return tree;
}

const clean = (input) => {
  let idx = 0, garbage = false, output = '', counted = 0;
  while (idx < input.length) {
    let chr = input[idx];
    if (garbage) {
      if (chr == '>') {
        garbage = false;
        idx++;
      } else if (chr == '!') {
        idx += 2;
      } else {
        counted++;
        idx++;
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
  return {cleaned: output, removed: counted};
}

solve(INPUT);
