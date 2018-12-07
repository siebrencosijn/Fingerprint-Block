class Node {
    constructor(value, left = null, right = null) {
        this.value = value;
        this.parent = null;
        this.left = left;
        this.right = right;
        if (left !== null) {
            left.parent = this;
        }
        if (right !== null) {
            right.parent = this;
        }
    }
}

class Leaf extends Node {
    constructor(index, value) {
        super(value);
        this.index = index;
    }
}

class Tree {
    constructor(fingerprints) {
        let priorityQueue = new PriorityQueue(x => x.value);
        for (let i = 0; i < fingerprints.length; i++) {
            priorityQueue.insert(new Leaf(i, fingerprints[i].weight));
        }
        while (priorityQueue.size > 1) {
            let left = priorityQueue.pop();
            let right = priorityQueue.pop();
            let parent = new Node(left.value + right.value, left, right);
            priorityQueue.insert(parent);
        }
        this.root = priorityQueue.size === 1 ? priorityQueue.pop() : null;
    }

    /**
     * Delete a leaf node from the tree and swap its parent with its sibling.
     */
    delete(node) {
        if (node === this.root) {
            this.root = null;
        } else {
            let value = node.value,
                parent = node.parent,
                parentofparent = parent.parent,
                sibling;
            if (node === parent.left) {
                sibling = parent.right;
            } else {
                sibling = parent.left;
            }
            sibling.parent = parentofparent;
            if (parentofparent !== null) {
                if (parent === parentofparent.left) {
                    parentofparent.left = sibling;
                } else {
                    parentofparent.right = sibling;
                }
            } else {
                this.root = sibling;
            }
            while (sibling.parent !== null) {
                sibling = sibling.parent;
                sibling.value -= value;
            }
        }
    }

    /**
     * Return the index of a random fingerprint. Deletes the node of that fingerprint.
     */
    generate() {
        let current = this.root;
        if (current === null)
            return undefined;
        let r = Math.random() * current.value;
        while (current.left !== null || current.right !== null) {
            if (r < current.left.value) {
                current = current.left;
            } else {
                r -= current.left.value;
                current = current.right;
            }
        }
        let index = current.index;
        this.delete(current);
        return index;
    }
}

export default Tree;
