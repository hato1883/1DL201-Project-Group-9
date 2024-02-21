import { Queue } from "./queue_immutable";
import { Node } from "./graphs";

export type Path = Queue<Node> | null;
export type Result = Path;
