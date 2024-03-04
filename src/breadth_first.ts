import { ListGraph, Node, create_path } from "./graphs";
import { filter, for_each, pair } from "./list";
import { Stream, Result, Path } from "./path";
import {
    Queue, enqueue, dequeue, queue_to_array,
    empty as empty_queue,
    is_empty as is_queue_empty,
    head as queue_head

} from "./queue_array";

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

    // Stores information if node has been handeled
    const exploration_state = Array<number>(graph.size).fill(initialized);

    // Used for visiulasation, holds all handeled nodes
    const visited_nodes = Array<Node>();

    // Holds what node connection that lead to this node
    const prev = Array<Node>(graph.size);

    // Queue showing what node is next to check.
    let next_node: Queue<Node> = empty_queue();

    // Setup start node
    exploration_state[start] = visited;
    visited_nodes.push(start);
    enqueue(start, next_node);

    // changes state of node to visisted,
    // adds parent node if one was given else sets it to null.
    // enqueues node to queue of nodes to check.
    function lg_breadth_first_visit(
        parent: Node,
        neighbour: Node
    ): void {
        exploration_state[neighbour] = visited;
        visited_nodes.push(neighbour);
        enqueue(neighbour, next_node);
        prev[neighbour] = parent;
    }

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
                (neighbour) => lg_breadth_first_visit(node, neighbour),
                non_visited
            );

            const visited_nodes_this_loop = Array<Node>();
            for_each((node) => visited_nodes_this_loop.push(node), non_visited);

            return {
                in_queue: queue_to_array(next_node),
                visited_nodes: visited_nodes,
                current_node: node,
                path_so_far: create_path(start, node, prev),
                is_done: false
            };
        } else {
            return {
                in_queue: queue_to_array(next_node),
                visited_nodes: visited_nodes,
                current_node: -1,
                path_so_far: create_path(start, end, prev),
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
            path_so_far: create_path(start, end, prev),
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
