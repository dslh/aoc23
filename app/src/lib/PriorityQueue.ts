type Comparator<T> = (a: T, b: T) => number;

class PriorityQueue<T> {
    private heap: T[];
    private comparator: Comparator<T>;

    /**
     * Creates a priority queue with the given comparator.
     * @param comparator A function that determines the order of the elements.
     */
    constructor(comparator: Comparator<T>) {
        this.heap = [];
        this.comparator = comparator;
    }

    /**
     * Adds an element to the priority queue.
     * @param item The item to be added.
     */
    push(item: T): void {
        this.heap.push(item);
        this.heapifyUp();
    }

    /**
     * Removes and returns the element at the head of the priority queue.
     * @returns The element at the head of the queue.
     */
    pop(): T | undefined {
        if (this.size() === 0) return undefined;
        const item = this.heap[0];
        const last = this.heap.pop();
        if (this.size() !== 0) {
            this.heap[0] = last!;
            this.heapifyDown();
        }
        return item;
    }

    /**
     * Returns the element at the head of the priority queue without removing it.
     * @returns The element at the head of the queue.
     */
    get head(): T | undefined {
        return this.heap[0];
    }

    /**
     * Returns the number of elements in the priority queue.
     * @returns The size of the queue.
     */
    get size(): () => number {
        return () => this.heap.length;
    }

    /**
     * Checks if the priority queue is empty.
     * @returns `true` if the queue is empty, `false` otherwise.
     */
    get empty(): () => boolean {
        return () => this.size() === 0;
    }

    private heapifyUp(): void {
        let index = this.heap.length - 1;
        while (this.hasParent(index) && this.comparator(this.parent(index), this.heap[index]) > 0) {
            this.swap(this.parentIndex(index), index);
            index = this.parentIndex(index);
        }
    }

    private heapifyDown(): void {
        let index = 0;
        while (this.hasLeftChild(index)) {
            let smallerChildIndex = this.leftChildIndex(index);
            if (this.hasRightChild(index) && this.comparator(this.rightChild(index), this.leftChild(index)) < 0) {
                smallerChildIndex = this.rightChildIndex(index);
            }
            if (this.comparator(this.heap[index], this.heap[smallerChildIndex]) < 0) {
                break;
            } else {
                this.swap(index, smallerChildIndex);
            }
            index = smallerChildIndex;
        }
    }

    private leftChildIndex(parentIndex: number): number {
        return 2 * parentIndex + 1;
    }

    private rightChildIndex(parentIndex: number): number {
        return 2 * parentIndex + 2;
    }

    private parentIndex(childIndex: number): number {
        return Math.floor((childIndex - 1) / 2);
    }

    private hasLeftChild(index: number): boolean {
        return this.leftChildIndex(index) < this.heap.length;
    }

    private hasRightChild(index: number): boolean {
        return this.rightChildIndex(index) < this.heap.length;
    }

    private hasParent(index: number): boolean {
        return this.parentIndex(index) >= 0;
    }

    private leftChild(index: number): T {
        return this.heap[this.leftChildIndex(index)];
    }

    private rightChild(index: number): T {
        return this.heap[this.rightChildIndex(index)];
    }

    private parent(index: number): T {
        return this.heap[this.parentIndex(index)];
    }

    private swap(indexOne: number, indexTwo: number): void {
        [this.heap[indexOne], this.heap[indexTwo]] = [this.heap[indexTwo], this.heap[indexOne]];
    }
}

export default PriorityQueue
