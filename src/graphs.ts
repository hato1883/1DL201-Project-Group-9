import {
    type Pair, pair, head, tail, type List, is_null, for_each, filter
} from "../src/list";
import { Path } from "./path";
import {
    Queue, dequeue, enqueue,
    empty, is_empty,
    head as queue_head
} from "./queue_immutable";


/**
 * A Node in a graph.
 * @invariant the node is a non negative number
 */
export type Node = number;

/**
 * A list of edges in a graph.
 * Each edge is a pair, where the head is the source of the edge, 
 * and the tail is the target.
 * @invariant the head and tail are non-negative integers
 * @invariant the list does not contain any duplicate edges
 */
export type EdgeList = List<Pair<Node, Node>>;


/**
 * Add all reverse edges to an edge list, and remove all self loops.
 * @param el an edge list
 * @returns el with all reverse edges present, and all self loops removed
 */
export function undirected(el: EdgeList): EdgeList {
    if (is_null(el)) {
        return el;
    } else if (head(head(el)) === tail(head(el))) {
        return undirected(tail(el));
    } else {
        const source = head(head(el));
        const target = tail(head(el));
        return pair(
            pair(target, source),
            undirected(filter(
                (edge) => head(edge) !== target
                || tail(edge) !== source,
                tail(el)
            ))
        );
    }
}


// Build an array based on a function computing the item at each index
function build_array<T>(size: number, content: (i: number) => T): Array<T> {
    const result = Array<T>(size);
    for (var i = 0; i < size; i = i + 1) {
        result[i] = content(i);
    }
    return result;
}


/**
 * A graph in matrix representation is a square matrix of Booleans.
 * @param adj the matrix
 * @param size the number of nodes
 * @invariant The length of the outer array is size.
 * @invariant Every inner array has length size.
 */
export type MatrixGraph = {
    adj: Array<Array<boolean>>;
    size: number;
};


/**
 * Create a new matrix graph with no edges
 * @param size the number of nodes
 * @returns the new matrix graph, where each inner array entry is false.
 */
export function mg_new(size: number): MatrixGraph {
    return { size,
             adj: build_array(size, () => build_array(size, () => false)) };
}


/**
 * Create a new matrix graph with a given set of edges
 * @param size the number of nodes
 * @param edges an edge list
 * @invariant all node ids in the edge list are < size.
 * @returns the new matrix graph, with the given edges.
 */
export function mg_from_edges(size: number, edges: EdgeList): MatrixGraph {
    const result = mg_new(size);
    for_each((p) => result.adj[head(p)][tail(p)] = true, edges);
    return result;
}


/**
 * A graph in edge lists representation is 
 *     an array of lists of target node ids.
 * The length of the array is the number of nodes.
 * @invariant Every target node id is a non-negative number 
 *     less than the length of the outer array.
 * @invariant None of the target node ids appears twice in the same list.
 */
export type ListGraph = {
    adj: Array<List<Node>>; // Lists may not be sorted
    size: number;
};


/**
 * Create a new ListGraph with no edges
 * @param size the number of nodes in the list graph
 * @returns a new list graph with size edges.
 */
export function lg_new(size: number): ListGraph {
    return { size, adj: build_array(size, () => null) };
}


/**
 * Create a new ListGraph with a given set of edges
 * @param size the number of nodes in the list graph
 * @param edges an edge list
 * @invariant all node ids in the edge list are < size.
 * @returns the new ListGraph, with the given edges.
 */
export function lg_from_edges(size: number, edges: EdgeList): ListGraph {
    const result = lg_new(size);
    for_each(
        (p) => result.adj[head(p)] = pair(tail(p), result.adj[head(p)]),
        edges
    );
    return result;
}


/**
 * Transpose a list graph
 * @param adj a list graph
 * @returns the transpose of adj
 */
export function lg_transpose({ size, adj }: ListGraph): ListGraph {
    const result = lg_new(size);
    for (var i = 0; i < size; i = i + 1) {
        for_each((p) => result.adj[p] = pair(i, result.adj[p]), adj[i]);
    }
    return result;
}

/**
 * Transpose a list graph
 * @param adj a list graph
 * @returns the transpose of adj
 */
export function lg_bfs(
    { size, adj }: ListGraph,
    start: Node,
    end: Node
): Path {
    // Exploration states
    const initialized = 0;
    const visited = 1;

    // const explored = 2;

    // create a data type to store:
    // initialized / visited / explored state of each node.
    const exploration_state = Array(size).fill(initialized);

    // create a data type to store closest node
    // is null if it is our starting node,
    // and undefined if node has no parent otherwise points to parent node
    const closest_parent_node = Array<Node | null>(size);

    // Queue showing what node is next to check.
    let next_node: Queue<Node> = empty();

    // changes state of node to visisted,
    // adds parent node if one was given else sets it to null.
    // enqueues node to queue of nodes to check.
    function lg_bfs_visit(node: Node, parent: Node | null = null): void {
        exploration_state[node] = visited;
        closest_parent_node[node] = closest_parent_node[node] === undefined
            ? parent
            : closest_parent_node[node];
        next_node = enqueue(node, next_node);
    }

    // enqueues the starting node
    lg_bfs_visit(start);

    // Stepwise progression of bfs algorithm,
    // can easily be made into a stream call.
    function lg_bfs_step(): boolean {
        if (!is_empty(next_node)) {
            const node = queue_head(next_node);
            next_node = dequeue(next_node);
            if (node === end) {
                // TODO: return result
                return false;
            }
            for_each(
                (unvisted_node) => lg_bfs_visit(unvisted_node, node),
                filter((edge_endpoint) => {
                    return exploration_state[edge_endpoint] === initialized;
                }, adj[node])
            );
            return true;
        } else {
            return false;
        }
    }

    // runs lg_bfs_step untill we have either visited all nodes
    // or we are at the goal.
    let running = lg_bfs_step();
    while (running) {
        // run lg_bfs_step untill we are at the end.
        running = lg_bfs_step();
    }

    // use the closest_parent_node to build a path from end node to start node.
    function build_path(node: Node): Path {
        if (closest_parent_node[node] === null) {
            // If parent node has null as parent node
            // that means it was the starting node
            // Meaning there is a path from Start to End
            return enqueue(node, empty());
        } else if (closest_parent_node[node] === undefined) {
            // If parent node has undefined as parent node
            // that means it did not orignate from start node
            // Meaning there is no path from Start to End
            return null;
        } else {
            const path = build_path(closest_parent_node[node] as Node);

            // If no path was made from parent node That means there are no path
            // else add this node last to the path
            return is_empty(path) ? path : enqueue(node, path);
        }
    }
    return build_path(end);
}
