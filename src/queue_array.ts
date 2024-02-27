/**
 * A homogeneous queue.
 * The first entry points to the index of the queue's head element,
 * the second entry points to the next empty index of the queue, and
 * the last entry holds the values (contents) of the queue.
 * @template T type of all queue elements
 */
export type Queue<T> = [number, number, Array<T>];

// Location of the head index in the Priority queue object
const queue_head = 0;

// Location of the tail index in the Priority queue object
const next_empty = 1;

// Location of the queue in the Priority queue object
const q_arr = 2;

/**
 * Constructs a queue without any elements.
 * @template T type of all queue elements
 * @returns Returns an empty queue.
 */
export function empty<T>(): Queue<T> {
    return [0, 0, []];
}

/**
 * Constructs a queue with all given elements in order,
 * First element in the arguments is the first element in the Queue
 * 
 * @example
 * ```ts
 * queue(1, 2, 3);
 * // results in the Queue(1, 2, 3)
 * // where 1 is first and 3 is last.
 * ```
 * 
 * @template T type of all queue elements
 * @returns Returns an empty queue.
 */
export function queue<T>(...args: Array<T>): Queue<T> {
    const result_queue = empty<T>();
    args.reduce(
        (built_stack: Queue<T>, item: T) => {
            enqueue(item, built_stack);
            return result_queue;
        },
        result_queue
    );
    return result_queue;
}

/**
 * Checks whether a queue is empty.
 * @template T type of all queue elements
 * @param q queue to check for emptiness
 * @returns Returns true, if the queue q has elements, false otherwise.
 */
export function is_empty<T>(q: Queue<T>): boolean {
    return q[queue_head] === q[next_empty];
}

/**
 * Adds an element to the queue.
 * @template T type of all queue elements
 * @param e element to add
 * @param q queue to modify
 * @modifies q by adding element e to the end
 */
export function enqueue<T>(e: T, q: Queue<T>): void {
    const tail_index = q[next_empty];
    q[q_arr][tail_index] = e;
    q[next_empty] = tail_index + 1;  // update tail index
}

/**
 * Retrieves the first element of the queue.
 * @precondition Assumes q to be non-empty
 * @template T type of all queue elements
 * @param q queue to get the first element of
 * @returns Returns the element of the queue that was enqueued first.
 */
export function head<T>(q: Queue<T>): T {
    const head_index = q[queue_head];
    return q[q_arr][head_index];
}

/**
 * Removes the first element of a queue.
 * @precondition Assumes q to be non-empty
 * @template T type of all queue elements
 * @param q queue to remove the element from
 * @modifies q such that the element that was enqueued first is removed
 */
export function dequeue<T>(q: Queue<T>): void {
    const head_index = q[queue_head];
    q[queue_head] = head_index + 1;
}

/**
 * Pretty-prints the contents of a queue to standard output.
 * @template T type of all queue elements
 * @param q queue to pretty-print
 */
export function display_queue<T>(q: Queue<T>): void {
    let msg = "queue(";
    for (let index = q[queue_head]; index < q[next_empty]; index++) {
        msg = msg + q[q_arr][index];
        if (index + 1 < q[next_empty]) {
            msg = msg + ", ";
        }
    }
    msg = msg + ")";
    console.log(msg);
}

/**
 * Creates a array with items in the same order of the queue.
 * First item in queue is put at index 0, n:th item in queue is put at index n-1
 * 
 * @example
 * ```ts
 * const init_q = queue(1, 2, 3, 4);
 * queue_to_array(init_q);
 * // returns array [1, 2, 3, 4]
 * 
 * dequeue(init_q);
 * queue_to_array(init_q);
 * // returns array [2, 3, 4]
 * 
 * enqueue(5, init_q);
 * queue_to_array(init_q);
 * // returns array [2, 3, 4, 5]
 * ```
 * 
 * @template T type of all queue elements
 * @param q queue to create a array from
 */
export function queue_to_array<T>(q: Queue<T>): Array<T> {
    const result_array = (q[next_empty] - q[queue_head]) === 0
        ? Array<T>()
        : Array<T>((q[next_empty] - q[queue_head]));
    for (let q_index = q[queue_head];
        q_index < q[next_empty];
        q_index++) {
        result_array.push(q[q_arr][q_index]);
    }
    return result_array;
}
