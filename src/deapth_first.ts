import { ListGraph, Node, create_path } from "./graphs";
import { filter, for_each, pair } from "./list";
import { Stream, Result, Path } from "./path";
import {
    Stack, push, pop, top,
    empty, is_empty, stack_to_array

} from "./stack";

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

    // Stores information if node has been handeled
    const exploration_state = Array<number>(graph.size).fill(initialized);

    // Used for visiulasation, holds all handeled nodes
    const visited_nodes = Array<Node>();

    // Holds what node connection that lead to this node
    const prev = Array<Node>(graph.size);

    // Queue showing what node is next to check.
    let next_node: Stack<Node> = empty();

    // Setup start node
    exploration_state[start] = visited;
    visited_nodes.push(start);
    next_node = push(start, next_node);

    // changes state of node to visisted,
    // adds parent node if one was given else sets it to null.
    // enqueues node to queue of nodes to check.
    function lg_depth_first_visit(
        parent: Node,
        neighbour: Node
    ): void {
        exploration_state[neighbour] = visited;
        visited_nodes.push(neighbour);
        next_node = push(neighbour, next_node);
        prev[neighbour] = parent;
    }

    // Stepwise progression of dfs algorithm,
    // can easily be made into a stream call.
    function lg_depth_first_step(): Result {
        if (!is_empty(next_node)) {
            const node = top(next_node);
            next_node = pop(next_node);
            if (node === end) {
                return {
                    in_queue: stack_to_array(next_node),
                    visited_nodes: visited_nodes,
                    current_node: node,
                    path_so_far: create_path(start, end, prev),
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
                (neighbour) => lg_depth_first_visit(node, neighbour),
                non_visited
            );

            const visited_nodes_this_loop = Array<Node>();
            for_each((node) => visited_nodes_this_loop.push(node), non_visited);

            return {
                in_queue: stack_to_array(next_node),
                visited_nodes: visited_nodes,
                current_node: node,
                path_so_far: create_path(start, node, prev),
                is_done: false
            };
        } else {
            return {
                in_queue: stack_to_array(next_node),
                visited_nodes: visited_nodes,
                current_node: -1,
                path_so_far: create_path(start, end, prev),
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
            path_so_far: create_path(start, end, prev),
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
