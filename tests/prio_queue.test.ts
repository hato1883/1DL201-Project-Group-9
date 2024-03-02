import {
    PrioQueue,
    empty, is_empty, dequeue,
    head, enqueue, display_queue, queue, update_prio, queue_to_array
} from "../src/prio_queue";


/**
 * Test implementation of queue
 */
test("test creating a empty queue", () => {
    expect(empty()).toStrictEqual([0, 0, []]);
});

test("test creating a non empty queue", () => {
    let q: PrioQueue<number>;
    q = queue([0, 1], [0, 2]);
    expect(q).toStrictEqual([0, 2, [[0, 1], [0, 2]]] as PrioQueue<number>);

    expect(head(q)).toStrictEqual(1);

    dequeue(q);
    expect(q).toStrictEqual([1, 2, [[0, 1], [0, 2]]] as PrioQueue<number>);


    q = queue([0, 1], [0, 2], [0, 3], [0, 4]);
    expect(q).toStrictEqual(
        [0, 4, [[0, 1], [0, 2], [0, 3], [0, 4]]] as PrioQueue<number>
    );

    expect(head(q)).toStrictEqual(1);

    dequeue(q);
    expect(q).toStrictEqual(
        [1, 4, [[0, 1], [0, 2], [0, 3], [0, 4]]] as PrioQueue<number>
    );


    q = queue([0, 1], [1, 2], [2, 3], [3, 4]);
    expect(q).toStrictEqual(
        [0, 4, [[3, 4], [2, 3], [1, 2], [0, 1]]] as PrioQueue<number>
    );


    q = queue([0, 1], [2, 2], [1, 3], [3, 4]);
    expect(q).toStrictEqual(
        [0, 4, [[3, 4], [2, 2], [1, 3], [0, 1]]] as PrioQueue<number>
    );
});

test("test if queue is empty", () => {
    expect(is_empty(empty())).toBeTruthy();

    expect(is_empty(
        ([0, 0, []] as PrioQueue<unknown>)
    )).toBeTruthy();

    expect(is_empty(
        ([0, 4, [[0, 1], [0, 2], [0, 3]]] as PrioQueue<number>)
    )).toBeFalsy();

    expect(is_empty(
        ([0, 4, [[0, "1"], [0, "2"], [0, "3"]]] as PrioQueue<string>)
    )).toBeFalsy();

    expect(is_empty(
        [0, 1, [[0, "1"]]]
    )).toBeFalsy();
});

test("test pushing item to queue", () => {
    let empty_queue = empty();
    enqueue(0, "1", empty_queue);
    expect(empty_queue).toStrictEqual([0, 1, [[0, "1"]]]);


    enqueue(0, "2", empty_queue);
    expect(empty_queue).toStrictEqual([0, 2, [[0, "1"], [0, "2"]]]);


    enqueue(0, "3", empty_queue);
    expect(empty_queue).toStrictEqual([0, 3, [[0, "1"], [0, "2"], [0, "3"]]]);


    enqueue(0, "4", empty_queue);
    expect(empty_queue).toStrictEqual(
        [0, 4, [[0, "1"], [0, "2"], [0, "3"], [0, "4"]]]
    );

    empty_queue = empty();
    enqueue(0, "1", empty_queue);
    expect(empty_queue).toStrictEqual([0, 1, [[0, "1"]]]);


    enqueue(1, "2", empty_queue);
    expect(empty_queue).toStrictEqual([0, 2, [[1, "2"], [0, "1"]]]);


    enqueue(2, "3", empty_queue);
    expect(empty_queue).toStrictEqual([0, 3, [[2, "3"], [1, "2"], [0, "1"]]]);


    enqueue(3, "4", empty_queue);
    expect(empty_queue).toStrictEqual(
        [0, 4, [[3, "4"], [2, "3"], [1, "2"], [0, "1"]]]
    );

    empty_queue = empty();
    enqueue(0, "1", empty_queue);
    expect(empty_queue).toStrictEqual([0, 1, [[0, "1"]]]);


    enqueue(2, "2", empty_queue);
    expect(empty_queue).toStrictEqual([0, 2, [[2, "2"], [0, "1"]]]);


    enqueue(1, "3", empty_queue);
    expect(empty_queue).toStrictEqual([0, 3, [[2, "2"], [1, "3"], [0, "1"]]]);


    enqueue(3, "4", empty_queue);
    expect(empty_queue).toStrictEqual(
        [0, 4, [[3, "4"], [2, "2"], [1, "3"], [0, "1"]]]
    );
});

test("test calling top of a queue", () => {
    expect(
        head(([0, 1, [[0, "1"]]] as PrioQueue<unknown>))
    ).toStrictEqual("1");

    expect(
        head(([0, 2, [[0, "2"], [0, "1"]]] as PrioQueue<unknown>))
    ).toStrictEqual("2");

    expect(
        head(([0, 3, [[0, "3"], [0, "2"], [0, "1"]]] as PrioQueue<unknown>))
    ).toStrictEqual("3");

    let empty_queue = empty();
    enqueue(0, "1", empty_queue);
    expect(head(empty_queue)).toStrictEqual("1");


    enqueue(0, "2", empty_queue);
    expect(head(empty_queue)).toStrictEqual("1");

    empty_queue = empty();
    enqueue(0, "2", empty_queue);
    enqueue(0, "1", empty_queue);
    expect(head(empty_queue)).toStrictEqual("2");
});

test("test calling pop of a queue", () => {
    let q: PrioQueue<string>;

    q = [0, 1, [[0, "1"]]];
    dequeue(q);
    expect(q).toStrictEqual([1, 1, [[0, "1"]]]);


    q = [0, 2, [[0, "2"], [0, "1"]]];
    dequeue(q);
    expect(q).toStrictEqual([1, 2, [[0, "2"], [0, "1"]]]);


    q = [0, 3, [[0, "3"], [0, "2"], [0, "1"]]];
    dequeue(q);
    expect(q).toStrictEqual([1, 3, [[0, "3"], [0, "2"], [0, "1"]]]);


    q = empty();
    enqueue(0, "1", q);
    dequeue(q);
    expect(q).toStrictEqual([1, 1, [[0, "1"]]]);


    q = empty();
    enqueue(0, "1", q);
    enqueue(0, "2", q);
    dequeue(q);
    expect(q).toStrictEqual([1, 2, [[0, "1"], [0, "2"]]]);


    q = empty();
    enqueue(0, "1", q);
    enqueue(0, "2", q);
    enqueue(0, "3", q);
    dequeue(q);
    expect(q).toStrictEqual([1, 3, [[0, "1"], [0, "2"], [0, "3"]]]);
});

test("test calling display_queue on a queue", () => {
    // replace console.log function
    const console_log_mock = jest.spyOn(console, "log").mockImplementation();

    display_queue(([0, 0, []] as PrioQueue<unknown>));
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith("queue()");

    display_queue(([0, 1, [[0, "1"]]] as PrioQueue<unknown>));
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenCalledWith("queue(0,1)");

    display_queue(([0, 2, [[0, "2"], [0, "1"]]] as PrioQueue<unknown>));
    expect(console.log).toHaveBeenCalledTimes(3);
    expect(console.log).toHaveBeenCalledWith("queue(0,2, 0,1)");

    display_queue(
        ([0, 3, [[0, "3"], [0, "2"], [0, "1"]]] as PrioQueue<unknown>)
    );
    expect(console.log).toHaveBeenCalledTimes(4);
    expect(console.log).toHaveBeenCalledWith("queue(0,3, 0,2, 0,1)");

    // restore original function
    console_log_mock.mockRestore();
});


test("test updating prio of item in queue", () => {
    let empty_queue = queue([0, "1"], [0, "2"], [0, "3"], [0, "4"]);
    expect(empty_queue).toStrictEqual(
        [0, 4, [[0, "1"], [0, "2"], [0, "3"], [0, "4"]]]
    );

    update_prio(3, "4", empty_queue);
    expect(empty_queue).toStrictEqual(
        [0, 4, [[3, "4"], [0, "1"], [0, "2"], [0, "3"]]]
    );

    // test updating of non existing element.
    update_prio(0, "5", empty_queue);
    expect(empty_queue).toStrictEqual(
        [0, 4, [[3, "4"], [0, "1"], [0, "2"], [0, "3"]]]
    );

    update_prio(10, "4", empty_queue);
    expect(empty_queue).toStrictEqual(
        [0, 4, [[10, "4"], [0, "1"], [0, "2"], [0, "3"]]]
    );

    update_prio(5, "2", empty_queue);
    expect(empty_queue).toStrictEqual(
        [0, 4, [[10, "4"], [5, "2"], [0, "1"], [0, "3"]]]
    );

    update_prio(7, "1", empty_queue);
    expect(empty_queue).toStrictEqual(
        [0, 4, [[10, "4"], [7, "1"], [5, "2"], [0, "3"]]]
    );

    update_prio(1000, "3", empty_queue);
    expect(empty_queue).toStrictEqual(
        [0, 4, [[1000, "3"], [10, "4"], [7, "1"], [5, "2"]]]
    );
});


test("test creating array from prio queue", () => {
    let empty_queue = queue([0, "1"], [0, "2"], [0, "3"], [0, "4"]);
    expect(empty_queue).toStrictEqual(
        [0, 4, [[0, "1"], [0, "2"], [0, "3"], [0, "4"]]]
    );
    expect(queue_to_array(empty_queue)).toStrictEqual(
        ["1", "2", "3", "4"]
    );


    update_prio(10, "4", empty_queue);
    expect(queue_to_array(empty_queue)).toStrictEqual(
        ["4", "1", "2", "3"]
    );

    update_prio(5, "2", empty_queue);
    expect(queue_to_array(empty_queue)).toStrictEqual(
        ["4", "2", "1", "3"]
    );

    update_prio(7, "1", empty_queue);
    expect(queue_to_array(empty_queue)).toStrictEqual(
        ["4", "1", "2", "3"]
    );

    update_prio(1000, "3", empty_queue);
    expect(empty_queue).toStrictEqual(
        [0, 4, [[1000, "3"], [10, "4"], [7, "1"], [5, "2"]]]
    );
    expect(queue_to_array(empty_queue)).toStrictEqual(
        ["3", "4", "1", "2"]
    );
});
