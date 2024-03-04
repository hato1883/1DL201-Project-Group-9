import {
    type Pair, pair, head, tail, type List, is_null, for_each, filter
} from "../src/list";
import { Path } from "./path";
import { empty, queue } from "./queue_array";


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
 * Creates a Queue<Node> from Start to End.
 * Queue will be empty if there is no path.
 * 
 * @example
 * create_path(0, 0, Array<Node>(1));
 * // results in the Queue(0). To reach 0 from 0 you just visit 0
 * 
 * @example
 * create_path(0, 1, Array<Node>(2));
 * // results in the Queue().
 * // To reach 1 from 0 is imposible becuse they are not connected
 * 
 * @example
 * const prev = Array<Node>(2);
 * prev[1] = 0;  // sets Node 1's parent to be Node 0
 * create_path(0, 1, prev);
 * // results in the Queue(0, 1).
 * 
 * 
 * @param start Node that the path starts on if a Path exist
 * @param dest Node that path ends on if a Path exists
 * @param previous_nodes A Array containing a single parent node for the
 * given node at index of node. (parent_nodes[node] gives the previous of node)
 * @returns A Queue<Node> of nodes to visit to go from start to the end
 * If there is no Path queue wil be empty.
 */
export function create_path(
    start: Node,
    dest: Node,
    previous_nodes: Array<Node>
): Path {
    const reversed_path = Array<Node>();
    let current_node = dest;
    if (start === dest
        || previous_nodes[current_node] !== undefined) {
        while (current_node !== undefined) {
            reversed_path.push(current_node);
            if (current_node === start) {
                break;
            }
            current_node = previous_nodes[current_node];
        }

        // Create path by reversing array that is path right to left.
        // After reverse we queue left to right into a new Queue.
        return queue<Node>(...reversed_path.reverse());
    } else {
        // no path
        return empty();
    }
}
