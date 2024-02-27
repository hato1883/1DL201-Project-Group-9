import {
    type Pair, pair, head, tail, type List, is_null, for_each, filter
} from "../src/list";
import { Path, Result, Stream } from "./path";
import {
    Stack, pop, push,
    empty as empty_stack,
    is_empty as is_stack_empty,
    top as stack_head,
    stack_to_array
} from "./stack";
import {
    Queue, dequeue, enqueue,
    empty as empty_queue,
    is_empty as is_queue_empty,
    head as queue_head,
    queue_to_array
} from "./queue_array";
import {
    PrioQueue,
    dequeue as prio_dequeue,
    enqueue as prio_enqueue,
    is_empty as is_prio_empty,
    empty as empty_prio_queue,
    head as prio_queue_head,
    update_prio
} from "./prio_queue";
import { Maze, deepen_index } from "./maze";


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
 * Runs the deapth first serach algorithm to find a path between start and end,
 * This dose not account for weigthed graphs.
 * 
 * @example
 * ```ts
 * const listgraph: ListGraph = {
 *     adj: [
 *         list(1, 3),    // 0: -> 1, -> 3
 *         list(2, 5),    // 1: -> 2, -> 5
 *         list(6),       // 2: -> 6
 *         list(2, 4, 6), // 3: -> 2, -> 4, -> 6
 *         list(6),       // 4: -> 6
 *         list(4, 7),    // 5: -> 4, -> 5
 *         list(),        // 6:
 *         list(6)        // 7: -> 6
 *     ],
 *     size: 8
 * };
 * lg_breadth_first(listgraph, 0, 6);
 * // results in Queue(0, 3, 6)
 * // meaing 0 -> 3 -> 6
 * // if it always picks the last edge instead of the first
 * // But also possible to give you the
 * // result Queue(0, 1, 2, 6)
 * // meaing 0 -> 1 -> 2 -> 6
 * // if it always picks the first edge instead of the last
 * ```
 * 
 * @param graph the unweighted listgraph to perform the breadth first search on.
 * @param start the starting node to search from
 * @param end the ending node you want to reach
 * @returns A Path type conatining either
 * a Queue<Node> of nodes to visit in order to reach the end 
 * or null if no path was found from start to end.
 */
export function lg_depth_first(
    graph: ListGraph,
    start: Node,
    end: Node
): Stream<Result> {
    // Exploration states
    const initialized = 0;
    const visited = 1;

    // const explored = 2;

    // create a data type to store:
    // initialized / visited / explored state of each node.
    const exploration_state = Array<number>(graph.size).fill(initialized);

    // create a data type to store:
    // Completed visists
    const visited_nodes = Array<Node>(graph.size);

    // create a data type to store the path to the given node
    // (Path from `start` node)
    // All nodes start with a null path meaning there is no path
    const path_to_node = Array<Path>(graph.size);

    // Queue showing what node is next to check.
    let next_node: Stack<Node> = empty_stack();

    // changes state of node to visisted,
    // adds parent node if one was given else sets it to null.
    // enqueues node to queue of nodes to check.
    function lg_depth_first_visit(
        node: Node,
        path_so_far:
        Array<Node>
    ): Array<Node> {
        exploration_state[node] = visited;
        visited_nodes.push(node);
        next_node = push(node, next_node);
        return path_so_far.concat(node);
    }

    // enqueues the starting node with a empty path
    path_to_node[start] = lg_depth_first_visit(start, Array<Node>());

    // Stepwise progression of dfs algorithm,
    // can easily be made into a stream call.
    function lg_depth_first_step(): Result {
        if (!is_stack_empty(next_node)) {
            const node = stack_head(next_node);
            next_node = pop(next_node);
            if (node === end) {
                return {
                    in_queue: stack_to_array(next_node),
                    visited_nodes: visited_nodes,
                    current_node: node,
                    path_so_far: path_to_node[node],
                    is_done: true
                };
            }

            const non_visited = filter(
                (edge_endpoint) => {
                    return exploration_state[edge_endpoint] === initialized;
                },
                graph.adj[node]
            );

            for_each(
                (unvisted_node) => {
                    path_to_node[unvisted_node] = lg_depth_first_visit(
                        unvisted_node,
                        path_to_node[node]
                    );
                },
                non_visited
            );

            const visited_nodes_this_loop = Array<Node>();
            for_each((node) => visited_nodes_this_loop.push(node), non_visited);

            return {
                in_queue: stack_to_array(next_node),
                visited_nodes: visited_nodes,
                current_node: node,
                path_so_far: path_to_node[node],
                is_done: false
            };
        } else {
            return {
                in_queue: stack_to_array(next_node),
                visited_nodes: visited_nodes,
                current_node: -1,
                path_so_far: path_to_node[end],
                is_done: true
            };
        }
    }

    // Initialize stream with only starting node in the stack
    const stream: Stream<Result> = pair(
        {
            in_queue: stack_to_array(next_node),
            visited_nodes: Array<Node>(),
            current_node: -1,
            path_so_far: Array<Node>(),
            is_done: false
        },
        () => data_stream()
    );

    // runs a single step of the algorithm and returns the state.
    // paired with a refrence to this function to get the next state.
    // lazy evaluation
    function data_stream(): Stream<Result> {
        const result = lg_depth_first_step();
        return pair(
            result,
            result.is_done ? null : data_stream
        );
    }

    return stream;
}

/**
 * Runs the breadth first serach algorithm to find a path between start and end,
 * This dose not account for weigthed graphs.
 * 
 * @example
 * ```ts
 * const listgraph: ListGraph = {
 *     adj: [
 *         list(1, 3),    // 0: -> 1, -> 3
 *         list(2, 5),    // 1: -> 2, -> 5
 *         list(6),       // 2: -> 6
 *         list(2, 4, 6), // 3: -> 2, -> 4, -> 6
 *         list(6),       // 4: -> 6
 *         list(4, 7),    // 5: -> 4, -> 5
 *         list(),        // 6:
 *         list(6)        // 7: -> 6
 *     ],
 *     size: 8
 * };
 * lg_breadth_first(listgraph, 0, 6);
 * // results in Queue(0, 3, 6) after evaluating the stream
 * // meaing 0 -> 3 -> 6
 * ```
 * 
 * @param graph the unweighted listgraph to perform the breadth first search on.
 * @param start the starting node to search from
 * @param end the ending node you want to reach
 * @returns A Stream<Result> information regarding
 * the algorithms path thru the graph. It also contains
 * the path so far put this path can lead to a postion far away from the
 * end point. to get a path to the end you need to evaluate the stream
 * utill the is_done porpertie has evaluated to true.
 * when is_done is set to true you will have a path from start to end
 * if such a path exists.
 */
export function lg_breadth_first(
    graph: ListGraph,
    start: Node,
    end: Node
): Stream<Result> {
    // Exploration states
    const initialized = 0;
    const visited = 1;

    // const explored = 2;

    // create a data type to store:
    // initialized / visited / explored state of each node.
    const exploration_state = Array<number>(graph.size).fill(initialized);

    // create a data type to store:
    // Completed visists
    const visited_nodes = Array<Node>(graph.size);

    // create a data type to store the path to the given node
    // (Path from `start` node)
    // All nodes start with a null path meaning there is no path
    const path_to_node = Array<Path>(graph.size);

    // Queue showing what node is next to check.
    let next_node: Queue<Node> = empty_queue();

    // changes state of node to visisted,
    // adds parent node if one was given else sets it to null.
    // enqueues node to queue of nodes to check.
    function lg_breadth_first_visit(
        node: Node,
        path_so_far: Array<Node>
    ): Array<Node> {
        exploration_state[node] = visited;
        visited_nodes.push(node);
        enqueue(node, next_node);
        path_so_far.concat(node);
        return path_so_far.concat(node);
    }

    // enqueues the starting node with a empty path
    path_to_node[start] = lg_breadth_first_visit(start, Array<Node>());

    // Stepwise progression of bfs algorithm,
    // can easily be made into a stream call.
    function lg_breadth_first_step(): Result {
        if (!is_queue_empty(next_node)) {
            const node = queue_head(next_node);
            dequeue(next_node);
            if (node === end) {
                return {
                    in_queue: queue_to_array(next_node),
                    visited_nodes: visited_nodes,
                    current_node: node,
                    path_so_far: path_to_node[node],
                    is_done: true
                };
            }

            const non_visited = filter(
                (edge_endpoint) => {
                    return exploration_state[edge_endpoint] === initialized;
                },
                graph.adj[node]
            );

            for_each(
                (unvisted_node) => {
                    path_to_node[unvisted_node] = lg_breadth_first_visit(
                        unvisted_node,
                        path_to_node[node]
                    );
                },
                non_visited
            );

            const visited_nodes_this_loop = Array<Node>();
            for_each((node) => visited_nodes_this_loop.push(node), non_visited);

            return {
                in_queue: queue_to_array(next_node),
                visited_nodes: visited_nodes,
                current_node: node,
                path_so_far: path_to_node[node],
                is_done: false
            };
        } else {
            return {
                in_queue: queue_to_array(next_node),
                visited_nodes: visited_nodes,
                current_node: -1,
                path_so_far: path_to_node[end],
                is_done: true
            };
        }
    }

    // Initialize stream with only starting node in the queue
    const stream: Stream<Result> = pair(
        {
            in_queue: queue_to_array(next_node),
            visited_nodes: Array<Node>(),
            current_node: -1,
            path_so_far: Array<Node>(),
            is_done: false
        },
        () => data_stream()
    );

    function data_stream(): Stream<Result> {
        const result = lg_breadth_first_step();
        return pair(
            result,
            result.is_done ? null : data_stream
        );
    }

    return stream;
}


export function lg_dijkstra_path(
    graph: ListGraph,
    start: Node,
    end: Node
): Stream<Result> {
    // Priority Queue showing what node is next to check.
    let left_to_check: PrioQueue<Node> = empty_prio_queue();

    // stores distance to each node
    const dist = Array<number>(graph.size).fill(-Infinity);

    // stores Completed visists
    const completed = Array<Node>(graph.size);

    // Distance to start is known to be 0
    dist[start] = 0;

    // Queue all nodes with distance as priority.
    for (let node = 0; node < graph.size; node++) {
        prio_enqueue(dist[node], node, left_to_check);
    }

    // create a data type to store:
    // stores previous node to the given node
    const prev = Array<Node>(graph.size);

    // Handels the logic between a node and its neighbour
    function lg_dijkstra_visit(
        parent: Node,
        neighbour: Node
    ): void {
        // Our graph is unweigthed
        // which we can just assume means all weights are equal to 1
        // due to queue favoring larger priorities we must use negative values
        let calculated_dist = dist[parent] - 1;
        if (calculated_dist
            > dist[neighbour]
        ) {
            dist[neighbour] = calculated_dist;
            prev[neighbour] = parent;
            update_prio(calculated_dist, neighbour, left_to_check);
        }
    }

    // Stepwise progression of dijkstra's algorithm,
    function lg_dijkstra_step(): Result {
        if (!is_prio_empty(left_to_check)) {
            const node = prio_queue_head(left_to_check);
            completed.push(node);
            if (node === end) {
                return {
                    in_queue: Array(prio_queue_head(left_to_check)),
                    visited_nodes: completed,
                    current_node: node,
                    path_so_far: lg_dijkstra_create_path(node),
                    is_done: true
                };
            }
            prio_dequeue(left_to_check);

            for_each(
                (neighbour) => lg_dijkstra_visit(node, neighbour),
                graph.adj[node]
            );

            return {
                in_queue: Array(prio_queue_head(left_to_check)),
                visited_nodes: completed,
                current_node: node,
                path_so_far: lg_dijkstra_create_path(node),
                is_done: false
            };
        } else {
            // No path found
            return {
                in_queue: Array<Node>(),
                visited_nodes: completed,
                current_node: -1,
                path_so_far: Array<Node>(),
                is_done: true
            };
        }
    }

    function lg_dijkstra_create_path(dest: Node): Path {
        const reversed_path = [];
        let current_node = dest;
        if (prev[current_node] !== undefined) {
            while (current_node !== undefined) {
                reversed_path.push(current_node);
                current_node = prev[current_node];
            }

            // create path by enqueuing elements from right to left
            return reversed_path.reverse();
        } else {
            return Array<Node>();
        } // no path
    }

    // Initialize stream with only starting node in the stack
    const stream: Stream<Result> = pair(
        {
            in_queue: Array(prio_queue_head(left_to_check)),
            visited_nodes: Array<Node>(),
            current_node: -1,
            path_so_far: Array<Node>(),
            is_done: false
        },
        () => data_stream()
    );

    // runs a single step of the algorithm and returns the state.
    // paired with a refrence to this function to get the next state.
    // lazy evaluation
    function data_stream(): Stream<Result> {
        const result = lg_dijkstra_step();
        return pair(
            result,
            result.is_done ? null : data_stream
        );
    }

    return stream;
}


export function lg_a_star_path(
    graph: ListGraph,
    maze_ref: Maze,
    start: Node,
    end: Node
): Stream<Result> {
    function a_star_heuristic_geuss(
        node: Node,
        endpoint: Node
    ): number {
        const start_pos = deepen_index(
            node,
            maze_ref
        ) as { row: number; col: number };
        const end_pos = deepen_index(
            endpoint,
            maze_ref
        ) as { row: number; col: number };
        let dist = Math.abs(start_pos.row - end_pos.row)
            + Math.abs(start_pos.col - end_pos.col);

        // Get Manhattan distance
        return -dist;
    }

    // Priority Queue showing what node is next to check.
    let left_to_check: PrioQueue<Node> = empty_prio_queue();

    // ´stores distance to each node
    const dist_travled = Array<number>(graph.size).fill(-Infinity);

    // Distance to start is known to be 0
    dist_travled[start] = 0;

    // stores distance to each node
    const est_dist_left = Array<number>(graph.size).fill(-Infinity);

    // Distance to start is known to be 0
    est_dist_left[start] = a_star_heuristic_geuss(start, end);

    // stores Completed visists to Nodes
    const completed = Array<Node>(graph.size);

    // Queue all nodes with distance as priority.
    for (let node = 0; node < graph.size; node++) {
        prio_enqueue(est_dist_left[node], node, left_to_check);
    }

    // stores previous node to the given node
    const prev = Array<Node>(graph.size);

    // Handels the logic for the given node and its neighbour
    function lg_a_star_visit(
        parent: Node,
        neighbour: Node
    ): void {
        // Our graph is unweigthed
        // which we can just assume means all weights are equal to 1
        // due to queue favoring larger priorities we must use negative values
        let calculated_dist = dist_travled[parent] - 1;
        if (calculated_dist
            > dist_travled[neighbour]
        ) {
            dist_travled[neighbour] = calculated_dist;
            est_dist_left[neighbour] = calculated_dist
            + a_star_heuristic_geuss(neighbour, end);

            prev[neighbour] = parent;
            update_prio(est_dist_left[neighbour], neighbour, left_to_check);
        }
    }

    // Stepwise progression of A* algorithm,
    function lg_a_star_step(): Result {
        if (!is_prio_empty(left_to_check)) {
            const node = prio_queue_head(left_to_check);
            completed.push(node);
            if (node === end) {
                return {
                    in_queue: Array(prio_queue_head(left_to_check)),
                    visited_nodes: completed,
                    current_node: node,
                    path_so_far: lg_a_star_create_path(node),
                    is_done: true
                };
            }
            prio_dequeue(left_to_check);

            for_each(
                (neighbour) => lg_a_star_visit(node, neighbour),
                graph.adj[node]
            );

            return {
                in_queue: Array(prio_queue_head(left_to_check)),
                visited_nodes: completed,
                current_node: node,
                path_so_far: lg_a_star_create_path(node),
                is_done: false
            };
        } else {
            // No path found
            return {
                in_queue: Array<Node>(),
                visited_nodes: completed,
                current_node: -1,
                path_so_far: Array<Node>(),
                is_done: true
            };
        }
    }

    function lg_a_star_create_path(dest: Node): Path {
        const reversed_path = [];
        let current_node = dest;
        if (prev[current_node] !== undefined) {
            while (current_node !== undefined) {
                reversed_path.push(current_node);
                current_node = prev[current_node];
            }

            // create path by enqueuing elements from right to left
            return reversed_path.reverse();
        } else {
            return Array<Node>();
        } // no path
    }

    // Initialize stream with only starting node in the stack
    const stream: Stream<Result> = pair(
        {
            in_queue: Array(prio_queue_head(left_to_check)),
            visited_nodes: Array<Node>(),
            current_node: -1,
            path_so_far: Array<Node>(),
            is_done: false
        },
        () => data_stream()
    );

    // runs a single step of the algorithm and returns the state.
    // paired with a refrence to this function to get the next state.
    // lazy evaluation
    function data_stream(): Stream<Result> {
        const result = lg_a_star_step();
        return pair(
            result,
            result.is_done ? null : data_stream
        );
    }

    return stream;
}
