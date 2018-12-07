/**
 * Heap based priority queue.
 */
class PriorityQueue {
    constructor(valueFunc = x => x) {
        this._heap = [];
        this._valueFunc = valueFunc;
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
            if (this._valueFunc(item) >= this._valueFunc(parent))
                break;
            this._heap[parentIndex] = item;
            this._heap[index] = parent;
            index = parentIndex;
        }
    }

    _bubbleDown(index) {
        let item = this._heap[index];
        let itemValue = this._valueFunc(item);
        while (true) {
            let leftIndex = PriorityQueue._leftIndex(index);
            let rightIndex = PriorityQueue._rightIndex(index);
            let swap = null;
            if (leftIndex < this.size) {
                let left = this._heap[leftIndex];
                if (this._valueFunc(left) < itemValue) {
                    swap = leftIndex;
                }
            }
            if (rightIndex < this.size) {
                let right = this._heap[rightIndex];
                if (this._valueFunc(right) < (swap == null ? itemValue : this._valueFunc(swap))) {
                    swap = rightIndex;
                }
            }
            if (swap == null)
                break;
            this._heap[index] = this._heap[swap];
            this._heap[swap] = item;
            index = swap;
        }
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
