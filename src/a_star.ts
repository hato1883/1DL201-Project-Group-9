import { Node, create_path } from "./graphs";
import { for_each, pair } from "./list";
import { Maze, deepen_index, maze_to_listgraph } from "./maze";
import { Stream, Result } from "./path";
import {
    PrioQueue, enqueue, dequeue, update_prio,
    empty as empty_prio_queue,
    is_empty as is_prio_empty,
    head as prio_queue_head

} from "./prio_queue";

function a_star_heuristic_geuss(
    node: Node,
    endpoint: Node,
    maze_ref: Maze
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

/**
 * Runs the A Star algorithm to find a path between start and end
 * 
 * @example
 * ```ts
 * const maze = new_maze(3, free);
 * // * - * - * 
 * // |   |   | 
 * // * - * - * Paths are shown as - and |
 * // |   |   | Graph is undriected
 * // * - * - *
 * lg_a_star_path(maze, 0, 8);
 * // results in Queue(0, 1, 2, 5, 8) after evaluating the stream
 * // meaing 0 -> 1 -> 2 -> 5 -> 8
 * ```
 * @param maze_ref the Maze to solve.
 * @param start the starting node in the maze to search from
 * @param end the ending  node in the maze you want to reach
 * @returns A Stream<Result> information regarding
 * the algorithms path thru the graph. It also contains
 * the path so far put this path can lead to a postion far away from the
 * end point. to get a path to the end you need to evaluate the stream
 * utill the is_done porpertie has evaluated to true.
 * when is_done is set to true you will have a path from start to end
 * if such a path exists.
 */
export function lg_a_star_path(
    maze_ref: Maze,
    start: Node,
    end: Node
): Stream<Result> {
    // Creates a list graph of the given Maze
    const graph = maze_to_listgraph(maze_ref);

    // Priority Queue showing what node is next to check.
    let left_to_check: PrioQueue<Node> = empty_prio_queue();

    // ´stores distance to each node
    const dist_travled = Array<number>(graph.size).fill(-Infinity);

    // Distance to start is known to be 0
    dist_travled[start] = 0;

    // stores distance to each node
    const est_dist_left = Array<number>(graph.size).fill(-Infinity);

    // Distance to start is known to be 0
    est_dist_left[start] = a_star_heuristic_geuss(start, end, maze_ref);

    // stores Completed visists to Nodes
    const completed = Array<Node>(graph.size);

    // Queue all nodes with distance as priority.
    for (let node = 0; node < graph.size; node++) {
        enqueue(est_dist_left[node], node, left_to_check);
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
            est_dist_left[neighbour] = calculated_dist + a_star_heuristic_geuss(
                neighbour,
                end,
                maze_ref
            );

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
                    path_so_far: create_path(start, end, prev),
                    is_done: true
                };
            }
            dequeue(left_to_check);

            for_each(
                (neighbour) => lg_a_star_visit(node, neighbour),
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
        const result = lg_a_star_step();
        return pair(
            result,
            result.is_done ? null : data_stream
        );
    }

    return stream;
}
