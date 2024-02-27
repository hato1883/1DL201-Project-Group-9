import { Node } from "./graphs";
import { Pair } from "./list";

export type Path = Array<Node>;

// 1: vad som är i kön just nu,
// 2: besökt noder,
// 3: nuvarande node
// 4: nuvarande path
// 5: är klar?
// { in_queue: 1, 2, 3, 4, visited: start }
export type Result = {
    readonly in_queue: Array<Node>;
    readonly visited_nodes: Array<Node>;
    readonly current_node: Node;
    readonly path_so_far: Path;
    readonly is_done: boolean;
};

export type Stream<T> = Pair<T, (() => Stream<T>) | null>;
