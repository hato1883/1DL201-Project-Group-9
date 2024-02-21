import { Queue } from "./queue_immutable";
import { Node } from "./graphs";
import { Pair } from "./list";

export type Path = Queue<Node> | null;

// 1: vad som är i kön just nu,
// 2: besökt noder,
// 3: nuvarande node
// 4: nuvarande path
// 5: är klar?
// { in_queue: 1, 2, 3, 4, visited: start }
export type Result = {
    in_queue: Queue<Node>;
    visited_nodes: Array<Node>;
    current_node: Node;
    path_so_far: Path;
    is_done: boolean;
};

export type Stream<T> = Pair<T, (() => Stream<T>) | null>;
