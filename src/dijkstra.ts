import { ListGraph, Node, create_path } from "./graphs";
import { for_each, pair } from "./list";
import { Stream, Result } from "./path";
import {
    PrioQueue, enqueue, dequeue, update_prio,
    empty as empty_prio_queue,
    is_empty as is_prio_empty,
    head as prio_queue_head

} from "./prio_queue";


/**
 * Runs the dijkstra algorithm to find a path between start and end,
 * This dose accounts for weigthed graphs.
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
 * lg_dijkstra_path(listgraph, 0, 6);
 * // results in Queue(0, 3, 6) after evaluating the stream
 * // meaing 0 -> 3 -> 6
 * ```
 * 
 * @param graph the listgraph to perform the breadth first search on.
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
        enqueue(dist[node], node, left_to_check);
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
                    path_so_far: create_path(start, node, prev),
                    is_done: true
                };
            }
            dequeue(left_to_check);

            for_each(
                (neighbour) => lg_dijkstra_visit(node, neighbour),
                graph.adj[node]
            );

            return {
                in_queue: Array(prio_queue_head(left_to_check)),
                visited_nodes: completed,
                current_node: node,
                path_so_far: create_path(start, node, prev),
                is_done: false
            };
        } else {
            // No path found
            // unreachable due to all nodes bing queued at the start.
            return {
                in_queue: Array<Node>(),
                visited_nodes: completed,
                current_node: -1,
                path_so_far: create_path(start, end, prev),
                is_done: true
            };
        }
    }

    // Initialize stream with only starting node in the stack
    const stream: Stream<Result> = pair(
        {
            in_queue: Array(prio_queue_head(left_to_check)),
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
        const result = lg_dijkstra_step();
        return pair(
            result,
            result.is_done ? null : data_stream
        );
    }

    return stream;
}
