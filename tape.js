const Node = (left, right) => ({ value: 0, left: left, right: right });

function Tape() {
  this.current = Node(null, null);
  this.start = this.current;
  this.end = this.current;
  this.nodes = 1;
}

Tape.prototype.move = function (direction) {
  if (direction == 'left') {
    if (this.current.left == null) {
      this.nodes++;
      this.current.left = Node(null, this.current);
      this.start = this.current.left;
    }
    this.current = this.current.left;
  } else if (direction == 'right') {
    if (this.current.right == null) {
      this.nodes++;
      this.current.right = Node(this.current, null);
      this.end = this.current.right;
    }
    this.current = this.current.right;
  }
}

Tape.prototype.read = function() { return this.current.value; }
Tape.prototype.write = function(value) { this.current.value = value; }

Tape.prototype[Symbol.iterator] = function* () {
  var node = this.start;
  do { yield node.value } while ((node = node.right) !== null);
}

exports.Tape = Tape;
