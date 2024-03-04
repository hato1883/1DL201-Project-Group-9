/**
 * A homogeneous priority queue.
 * The first entry points to the index of the queue's head element,
 * the second entry points to the next empty index of the queue, and
 * the last entry holds the values (contents) of the queue.
 * Each value in the queue has a numeric priority, a larger number meaning
 * a higher priority.
 * @invariant Pairs in the array are ordered by priority, highest first.
 * @template T type of all queue elements
 */
export type PrioQueue<T> = [number, number, Array<[number, T]>];


// Location of the head index in the Priority queue object
const queue_head = 0;

// Location of the tail index in the Priority queue object
const next_empty = 1;

// Location of the queue in the Priority queue object
const q_arr = 2;

// Location of the priority in the queue element.
const prio_pos = 0;

// Location of the value in the queue element.
const value_pos = 1;

/**
 * Constructs a priority queue without any elements.
 * @example
 * empty();
 * // results in the data structure [0, 0, []]
 * @template T type of all queue elements
 * @returns Returns an empty queue.
 */
export function empty<T>(): PrioQueue<T> {
    return [0, 0, []];
}

/**
 * Constructs a PrioQueue with all given elements in order,
 * First element in the arguments is the first to be enqueued.
 *  (larger means higher priority)
 * 
 * @example
 * ```ts
 * queue([0, 1], [1, 2], [2, 3]);
 * // results in the order 3, 2, 1
 * // where 3 is first and 1 is last.
 * 
 * queue([3, 1], [2, 2], [1, 3]);
 * // results in the order 1, 2, 3
 * // where 1 is first and 3 is last.
 * ```
 * 
 * @template T type of all queue elements
 * @param args a Array containing pairs/tuples of
 * `[priority: number, element: T]` to be enqueue into the priority queue.
 * @returns Returns an empty queue.
 */
export function queue<T>(...args: Array<[number, T]>): PrioQueue<T> {
    // Location of the priority in the queue element.
    const prio = 0;

    // Location of the value in the queue element.
    const value = 1;

    const result_queue = empty<T>();
    args.reduce(
        (built_stack: PrioQueue<T>, item: [number, T]) => {
            enqueue(item[prio], item[value], built_stack);
            return result_queue;
        },
        result_queue
    );
    return result_queue;
}

/**
 * Checks whether a priority queue is empty.
 * 
 * @example <caption> Usage on empty Queue using empty() method</caption>
 * // results in true
 * is_empty(empty());
 * 
 * @example <caption> Usage on empty Queue using queue() method </caption>
 * // results in true
 * is_empty(queue());
 * 
 * @example <caption> Usage on a non empty Queue </caption>
 * // results in false
 * is_empty(queue([0, 1]));
 * 
 * @template T type of all queue elements
 * @param q queue to check for emptiness
 * @returns Returns true, if q has elements, false otherwise.
 * 
 */
export function is_empty<T>(q: PrioQueue<T>): boolean {
    return q[queue_head] === q[next_empty];
}

/**
 * Adds an element to a priority queue.
 * 
 * @example <caption> add element "1" with priority 0 to a empty queue</caption>
 * enqueue(0, "1", empty());
 * // results in a queue with the element "1" in the first spot.
 * 
 * @example <caption> Enqueue 2 elements to the same queue </caption>
 * const q = empty();
 * enqueue(0, "1", q);
 * enqueue(1, "2", q);
 * // results in a queue with the element
 * // "1" in the first spot and "2" in the secound
 * 
 * @template T type of all queue elements
 * @param prio priority of the new element (larger means higher priority)
 * @param e element to add
 * @param q queue to add element to
 * @modifies q such that e is added with priority prio
 */
export function enqueue<T>(prio: number, e: T, q: PrioQueue<T>): void {
    const tail_index = q[next_empty];
    q[q_arr][tail_index] = [prio, e];
    if (!is_empty(q)) {
        // we have at least one element
        const head_index = q[queue_head];
        const elems = q[q_arr];
        elems[tail_index] = [prio, e];

        // swap elements until we find the right spot
        for (let i = tail_index; i > head_index; i = i - 1) {
            if (elems[i - 1][prio_pos] >= elems[i][prio_pos]) {
                break;
            } else {
                // swap
                swap(elems, i, i - 1);
            }
        }
    } else {}
    q[next_empty] = tail_index + 1;  // update tail index
}

/**
 * Updates a elements priority in the queue to the new given priority.
 * 
 * @example <caption> update the priority of element "1" from 0 to 10</caption>
 * const q = empty();
 * enqueue(0, "1", q);
 * update_prio(10, "1", q)
 * // results in a queue with the element "1" in the first spot
 * // with priority 10.
 * 
 * @invariant Queue contains the given element.
 * @template T type of all queue elements
 * @param prio new priority of the element (larger means higher priority)
 * @param e element to replace priority of
 * @param q queue to update priority in
 * @modifies q such that e has the priority prio
 */
export function update_prio<T>(prio: number, e: T, q: PrioQueue<T>): void {
    // Find index of element
    const index_of_e = q[q_arr].findIndex(
        (value: [number, T]) => e === value[value_pos]
    );

    if (index_of_e >= 0) { // index of e was found
        const elems = q[q_arr];
        const head_index = q[queue_head];
        elems[index_of_e][prio_pos] = prio;

        // swap elements until we find the right spot
        for (let i = index_of_e; i > head_index; i = i - 1) {
            if (elems[i - 1][prio_pos] >= elems[i][prio_pos]) {
                break;
            } else {
                // swap
                swap(elems, i, i - 1);
            }
        }
    } else {} // element dose not exist in queue
}

function swap<T>(a: Array<T>, i: number, j: number): void {
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
}

/**
 * Retrieves the element with the highest priority from the queue.
 * If two elements have the same priority the one that was
 * enqueued first is returned.
 * 
 * @example 
 * <caption> Gets the first element of a non empty queue </caption>
 * const q = empty();
 * enqueue(0, "1", q);
 * head(q)
 * // results in the element "1".
 * 
 * @example 
 * <caption> Gets the first element of a queue with more elements </caption>
 * const q = empty();
 * enqueue(0, "1", q);
 * enqueue(1, "2", q);
 * enqueue(2, "3", q);
 * head(q)
 * // results in the element "3" due to it having the highest priority.
 * 
 * @precondition Assumes q to be non-empty
 * @template T type of all queue elements
 * @param q queue to get the highest-priority element of
 * @returns Returns the element of the queue that has the highest priority.
 */
export function head<T>(q: PrioQueue<T>): T {
    const head_index = q[queue_head];
    return q[q_arr][head_index][value_pos];
}

/**
 * Removes the element with highest priority from a queue.
 * If two elements have the same priority the one that was
 * enqueued first is dequeued first.
 * 
 * @example 
 * <caption> removes the first element of a non empty queue </caption>
 * const q = empty();
 * enqueue(0, "1", q);
 * dequeue(q)
 * // results in a empty queue ([1, 1, [[0, "1"]]]).
 * 
 * @example 
 * <caption> removes the first element of a queue with more elements </caption>
 * const q = empty();
 * enqueue(0, "1", q);
 * enqueue(1, "2", q);
 * enqueue(2, "3", q);
 * dequeue(q)
 * // results in a queue holding "2" then "1"
 * // [1, 3, [[2, "3"], [1, "2"], [0, "1"]]]
 * 
 * @precondition Assumes q to be non-empty
 * @template T type of all queue elements
 * @param q queue to remove the element from
 * @modifies q such that the element with the highest priority is removed
 */
export function dequeue<T>(q: PrioQueue<T>): void {
    const head_index = q[queue_head];
    q[queue_head] = head_index + 1;
}

/**
 * Pretty-prints the contents of a queue to standard output.
 * 
 * @example 
 * <caption> display a empty queue </caption>
 * display_queue(empty())
 * // results in cosnole printing "queue()".
 * 
 * @example 
 * <caption> display non empty queue </caption>
 * const q = empty();
 * enqueue(0, "1", q);
 * display_queue(q)
 * // results in cosnole printing "queue([0,1])".
 * 
 * @example 
 * <caption> display a queue with more elements </caption>
 * const q = empty();
 * enqueue(0, "1", q);
 * enqueue(1, "2", q);
 * enqueue(2, "3", q);
 * display_queue(q)
 * // results in cosnole printing
 * //"queue([2,3], [1,2], [0,1])".
 * 
 * @template T type of all queue elements
 * @param q queue to pretty-print
 */

export function display_queue<T>(q: PrioQueue<T>): void {
    let msg = "queue(";
    for (let index = q[queue_head]; index < q[next_empty]; index++) {
        msg = msg + "[" + q[q_arr][index].toString() + "]";
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
export function queue_to_array<T>(q: PrioQueue<T>): Array<T> {
    const result_array = Array<T>();
    for (let q_index = q[queue_head];
        q_index < q[next_empty];
        q_index++) {
        result_array.push(q[q_arr][q_index][value_pos]);
    }
    return result_array;
}
