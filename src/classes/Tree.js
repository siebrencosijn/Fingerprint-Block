const LEFT = 0;
const RIGHT = 1;

/**
 * Class representing a weighted node.
 */
class TreeNode {
    /**
     * Create a node.
     * @param {*} value - Value of the node.
     * @param {number} weight - Weight of the node.
     */
    constructor(value, weight) {
        this.value = value;
        this.weight = weight;
        this.sum = weight;
        this.size = 1;
        this.parent = null;
        this.children = [null, null];
    }

    /**
     * Return the size of the child node with given direction.
     * @param {number} dir - The direction (0 = left, 1 = right).
     * @return {number} Size of the child node.
     */
    cSize(dir) {
        return this.children[dir] !== null ? this.children[dir].size : 0;
    }

    /**
     * Return the sum of the child node with given direction.
     * @param {number} dir - The direction (0 = left, 1 = right).
     * @return {number} Sum of the child node.
     */
    cSum(dir) {
        return this.children[dir] !== null ? this.children[dir].sum : 0;
    }

    /**
     * Update the size and sum of the node.
     */
    update() {
        this.size = 1 + this.cSize(LEFT) + this.cSize(RIGHT);
        this.sum = this.weight + this.cSum(LEFT) + this.cSum(RIGHT);
    }

    /**
     * Print a graphical representation of this node and its children to the console.
     */
    print(prefix = "", isTail = true) {
        console.log(prefix + (isTail ? "└── " : "├── ") + this.value);
        if (this.children[LEFT] !== null && this.children[RIGHT] !== null) {
            this.children[LEFT].print(prefix + (isTail ? "    " : "│   "), false);
            this.children[RIGHT].print(prefix + (isTail ? "    " : "│   "), true);
        } else if (this.children[LEFT] !== null) {
            this.children[LEFT].print(prefix + (isTail ? "    " : "│   "), true);
        } else if (this.children[RIGHT] !== null) {
            this.children[RIGHT].print(prefix + (isTail ? "    " : "│   "), true);
        }
    }
}

/**
 * Class representing a binary tree with weighted nodes.
 */
class Tree {
    /**
     * Create an empty tree.
     */
    constructor() {
        this.root = null;
    }

    /**
     * Insert a new node into the tree.
     * @param {*} value - Value of the node.
     * @param {number} weight - Weight of the node.
     */
    insert(value, weight) {
        let n = new TreeNode(value, weight);
        let c = this.root;
        let p = null;
        let dir;
        while (c !== null) {
            p = c; 
            p.size++;
            p.sum += weight;
            dir = p.cSize(LEFT) <= p.cSize(RIGHT) ? LEFT : RIGHT;
            c = p.children[dir];
        }
        if (p === null) {
            this.root = n;
        } else {
            p.children[dir] = n;
            n.parent = p;
        }
    }

    /**
     * Delete a node from the tree.
     * @param {TreeNode} n - The node.
     */
    delete(n) {
        let l = n.children[LEFT];
        let r = n.children[RIGHT];
        if (l !== null && r !== null) {
            // two children
            let c = l.size > r.size ? l : r;
            while (c.children[LEFT] !== null || c.children[RIGHT] !== null) {
                let dir = c.cSize(LEFT) > c.cSize(RIGHT) ? LEFT : RIGHT;
                c = c.children[dir];
            }
            n.value = c.value;
            n.weight = c.weight;
            this._remove(c);
        } else if (l !== null) {
            // only left child
            this._remove(n, l);
        } else if (r !== null) {
            // only right child
            this._remove(n, r);
        } else {
            // no children
            this._remove(n);
        }
    }

    /**
     * Remove a node from the tree by replacing it with null or another node.
     * @param {TreeNode} n - The node to be removed.
     * @param {TreeNode} replacement - The replacement.
     */
    _remove(n, replacement = null) {
        let p = n.parent;
        if (p === null) {
            this.root = replacement;
        } else {
            if (n === p.children[LEFT]) {
                p.children[LEFT] = replacement;
            } else {
                p.children[RIGHT] = replacement;
            }
        }
        if (replacement !== null) {
            replacement.parent = p;
        }
        while (p !== null) {
            p.update();
            p = p.parent;
        }
    }

    /**
     * Return the value of a random node from the tree and delete the node.
     * @return {*} Value of the node.
     */
    random() {
        let curr = this.root;
        if (curr === null) {
            return null;
        }
        let r = Math.random() * curr.sum;
        while (true) {
            if (curr.cSum(LEFT) < r) {
                r -= curr.cSum(LEFT);
                if (r < curr.weight) {
                    let ret = {value: curr.value, weight: curr.weight};
                    this.delete(curr);
                    return ret;
                } else {
                    r -= curr.weight;
                    curr = curr.children[RIGHT];
                }
            } else {
                curr = curr.children[LEFT];
            }
        }
    }
}
export default Tree;
