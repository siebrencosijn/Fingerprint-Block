const PARENT = i => (i - 1) >> 1;
const LEFT   = i => 2 * i + 1;
const RIGHT  = i => 2 * i + 2;

/**
 * Class representing a weighted node.
 */
class TreeNode {
    /**
     * Create a node.
     * @param {number} id - Identifier of the node.
     * @param {*} value - Value of the node.
     * @param {number} weight - Weight of the node.
     */
    constructor(id, value, weight) {
        this.id = id;
        this.value = value;
        this.weight = weight;
        this.sum = weight;
        this.size = 1;
    }
}

/**
 * Class representing a binary tree with weighted nodes.
 */
class Tree {
    /**
     * Create an empty tree.
     * @param {number} size - Size of the tree.
     */
    constructor(size) {
        this.tree = new Array(size).fill(null);
        Object.seal(this.tree);
    }

    /**
     * Return the size of the tree.
     * @return {number} Size of the tree.
     */
    get size() {
        return this.tree.length;
    }

    /**
     * Return the node at given index.
     * @param {number} index - Index of the node.
     * @return {TreeNode} The node.
     */
    at(index) {
        return this.tree[index];
    }

    /**
     * Return the size of the left child.
     * @param {number} index - Index of the parent.
     * @return {number} Size of the left child.
     */
    leftSize(index) {
        let leftIndex = LEFT(index);
        if (leftIndex < this.size && this.tree[leftIndex] !== null) {
            return this.tree[leftIndex].size;
        }
        return 0;
    }

    /**
     * Return the size of the right child.
     * @param {number} index - Index of the parent.
     * @return {number} Size of the right child.
     */
    rightSize(index) {
        let rightIndex = RIGHT(index);
        if (rightIndex < this.size && this.tree[rightIndex] !== null) {
            return this.tree[rightIndex].size;
        }
        return 0;
    }

    /**
     * Return the sum of the left child.
     * @param {number} index - Index of the parent.
     * @return {number} Sum of the left child.
     */
    leftSum(index) {
        let leftIndex = LEFT(index);
        if (leftIndex < this.size && this.tree[leftIndex] !== null) {
            return this.tree[leftIndex].sum;
        }
        return 0;
    }

    /**
     * Return the sum of the right child.
     * @param {number} index - Index of the parent.
     * @return {number} Sum of the right child.
     */
    rightSum(index) {
        let rightIndex = RIGHT(index);
        if (rightIndex < this.size && this.tree[rightIndex] !== null) {
            return this.tree[rightIndex].sum;
        }
        return 0;
    }

    /**
     * Update the size and sum of a node.
     * @param {number} index - Index of the node.
     */
    update(index) {
        let node = this.tree[index];
        if (node !== null) {
            node.size = 1 + this.leftSize(index) + this.rightSize(index);
            node.sum = node.weight + this.leftSum(index) + this.rightSum(index);
        }
    }

    /**
     * Insert a new node into the tree.
     * @param {number} id - Identifier of the node.
     * @param {*} value - Value of the node.
     * @param {number} weight - Weight of the node.
     */
    insert(id, value, weight) {
        let node = new TreeNode(id, value, weight);
        let index = 0;
        let current = this.tree[index];
        while (current !== null) {
            current.size++;
            current.sum += weight;
            if (this.leftSize(index) <= this.rightSize(index)) {
                index = LEFT(index);
            } else {
                index = RIGHT(index);
            }
            current = this.tree[index];
        }
        this.tree[index] = node;
    }

    /**
     * Delete a node from the tree.
     * @param {number} index - Index of the node.
     */
    delete(index) {
        let replacementIndex = index;
        let leftSize = this.leftSize(index);
        let rightSize = this.rightSize(index);
        while (leftSize > 0 || rightSize > 0) {
            if (leftSize > rightSize) {
                replacementIndex = LEFT(replacementIndex);
            } else {
                replacementIndex = RIGHT(replacementIndex);
            }
            leftSize = this.leftSize(replacementIndex);
            rightSize = this.rightSize(replacementIndex);
        }
        this.tree[index] = this.tree[replacementIndex];
        this.tree[replacementIndex] = null;
        let parentIndex = PARENT(replacementIndex);
        while (parentIndex >= 0) {
            this.update(parentIndex);
            parentIndex = PARENT(parentIndex);
        }
    }

    /**
     * Return the value of a random node from the tree and delete the node.
     * @return {*} Value of the node.
     */
    random() {
        let index = 0;
        let current = this.tree[index];
        if (current === null) {
            return null;
        }
        let r = Math.random() * current.sum;
        while (true) {
            let leftSum = this.leftSum(index);
            if (leftSum < r) {
                r -= leftSum;
                if (r < current.weight) {
                    let ret = {
                        id: current.id,
                        value: current.value,
                        weight: current.weight
                    };
                    this.delete(index);
                    return ret;
                } else {
                    r -= current.weight;
                    index = RIGHT(index);
                }
            } else {
                index = LEFT(index);
            }
            current = this.tree[index];
        }
    }
}
export default Tree;
