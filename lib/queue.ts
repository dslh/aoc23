interface Item<T> {
  value: T;
  next?: Item<T>;
}

class Queue<T> {
  head?: Item<T>;
  tail?: Item<T>;

  get empty(): boolean {
    return !this.head;
  }

  peek(): T {
    return this.head.value;
  }

  pop(): T {
    const value = this.head.value;

    this.head = this.head.next;
    if (this.empty)
      this.tail = undefined;

    return value;
  }

  push(value: T) {
    const item = { value };
    if (this.empty) {
      this.head = this.tail = item;
    } else {
      this.tail.next = item;
      this.tail = item;
    }
  }
}

export default Queue;
