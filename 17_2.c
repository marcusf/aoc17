#include <stdio.h>
#include <stdlib.h>

/** Wrote this in C as node was too slow */
/** Still horribly slow */

struct Node {
  int value;
  struct Node* next;
} Node;

struct Node* createNode(int value, void* block) {
  struct Node* node = (block+value*sizeof(Node));
  node->value = value;
  node->next = node;
  return node;
}

struct Node* insertAfter(int value, struct Node* curr, void* block) {
  struct Node* new = createNode(value, block);
  new->next = curr->next;
  curr->next = new;
  return new;
}

struct Node* jump(struct Node* node, int steps) {
  while (steps > 0) {
    node = node->next;
    steps--;
  }
  return node;
}

int main(int argv, char** argc) {
  int STEP = 356;
  void* slab = malloc(50000000*sizeof(struct Node));
  struct Node* buffer = createNode(0, slab);
  struct Node* current = buffer;
  for (int i = 0; i < 50*1000*1000; i++) {
    current = jump(current, STEP);
    current = insertAfter(i, current, slab);
    if (i % 1000000 == 0) {
      printf("Done %d iterations\n", i);
    }
  }
  while (1) {
    if (current->value == 0) {
      printf("The value following 0 is %d", current->next->value);
      return 0;
    } else {
      current = current->next;
    }
  }
  return 0;
}
