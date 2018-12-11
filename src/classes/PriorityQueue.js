/**
 * Heap based priority queue.
 */
class PriorityQueue {
    constructor(comparator = (x, y) => x < y) {
        this._heap = [];
        this._comparator = comparator;
    }

    get size() {
        return this._heap.length;
    }

    insert(item) {
        this._heap.push(item);
        this._bubbleUp(this.size - 1);
    }

    pop() {
        let first = this._heap[0];
        let last = this._heap.pop();
        if (this.size > 0) {
            this._heap[0] = last;
            this._bubbleDown(0);
        }
        return first;
    }

    _bubbleUp(index) {
        let item = this._heap[index];
        while (index > 0) {
            let parentIndex = PriorityQueue._parentIndex(index);
            let parent = this._heap[parentIndex];
            if (!this._comparator(item, parent))
                break;
            this._heap[index] = parent;
            index = parentIndex;
        }
        this._heap[index] = item;
    }

    _bubbleDown(index) {
        let item = this._heap[index];
        while (true) {
            let leftIndex = PriorityQueue._leftIndex(index);
            let rightIndex = PriorityQueue._rightIndex(index);
            let swap = null;
            if (leftIndex < this.size) {
                let left = this._heap[leftIndex];
                if (this._comparator(left, item)) {
                    swap = leftIndex;
                }
            }
            if (rightIndex < this.size) {
                let right = this._heap[rightIndex];
                if (this._comparator(right, (swap === null ? item : this._heap[swap]))) {
                    swap = rightIndex;
                }
            }
            if (swap === null)
                break;
            this._heap[index] = this._heap[swap];
            index = swap;
        }
        this._heap[index] = item;
    }

    static _parentIndex(i) {
        return (i - 1) >> 1;
    }

    static _leftIndex(i) {
        return 2 * i + 1;
    }

    static _rightIndex(i) {
        return 2 * i + 2;
    }
}
export default PriorityQueue;
