import { Node } from "./graphs";
import { Pair } from "./list";

/**
 * A Path is a Array containing the "Path" to a given node.
 * First element in the array is the first node you need to visit
 * Next element at index 1 is the next node you need to visit.
 * Last element will be the traget/end node.
 * 
 * Path can be Empty ([]) if no Path to the node was found.
 */
export type Path = Array<Node>;


/**
 * A Result record holds all relevant information
 * from a pathfinding algorithm.
 * This includes:
 * A Array of nodes that are queued to be proccessed
 * A Array of nodes has been prossesed so far
 * The last visisted node
 * The path to the last visisted node
 * A True/False value showing if the algorithm is completed.
 */
export type Result = {
    readonly in_queue: Array<Node>;
    readonly visited_nodes: Array<Node>;
    readonly current_node: Node;
    readonly path_so_far: Path;
    readonly is_done: boolean;
};

/**
 * Simple lazy stream Type
 * @template T The type of the elements that the stream contains
 * @example
 * ```ts
 * // results in a infinite stream that always holds 1 in its head.
 * const ones: Stream<number> = pair(1, () => ones);
 * 
 * // results in a finite stream that has 2 ones in it.
 * const two_ones: Stream<number> = pair(1, () => pair(1, null));
 * ```
 * 
 */
export type Stream<T> = Pair<T, (() => Stream<T>) | null>;
