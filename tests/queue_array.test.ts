import {
    Queue,
    empty, is_empty, dequeue,
    head, enqueue, display_queue, queue
} from "../src/queue_array";


/**
 * Test implementation of queue
 */
test("test creating a empty queue", () => {
    expect(empty()).toStrictEqual([0, 0, []]);
});

test("test creating a non empty queue", () => {
    let q: Queue<number>;
    q = queue(1, 2);
    expect(q).toStrictEqual([0, 2, [1, 2]] as Queue<number>);

    expect(head(q)).toStrictEqual(1);

    dequeue(q);
    expect(q).toStrictEqual([1, 2, [1, 2]] as Queue<number>);


    q = queue(1, 2, 3, 4);
    expect(q).toStrictEqual([0, 4, [1, 2, 3, 4]] as Queue<number>);

    expect(head(q)).toStrictEqual(1);

    dequeue(q);
    expect(q).toStrictEqual([1, 4, [1, 2, 3, 4]] as Queue<number>);
});

test("test if queue is empty", () => {
    expect(is_empty(empty())).toBeTruthy();
    expect(is_empty(([0, 0, []] as Queue<unknown>))).toBeTruthy();
    expect(is_empty(([0, 4, [1, 2, 3]] as Queue<unknown>))).toBeFalsy();
    expect(is_empty(([0, 4, ["1", "2", "3"]] as Queue<string>))).toBeFalsy();
    expect(is_empty(([0, 1, ["1"]]))).toBeFalsy();
});

test("test pushing item to queue", () => {
    let empty_queue = empty();
    enqueue("1", empty_queue);
    expect(empty_queue).toStrictEqual([0, 1, ["1"]]);


    enqueue("2", empty_queue);
    expect(empty_queue).toStrictEqual([0, 2, ["1", "2"]]);


    enqueue("3", empty_queue);
    expect(empty_queue).toStrictEqual([0, 3, ["1", "2", "3"]]);


    enqueue("4", empty_queue);
    expect(empty_queue).toStrictEqual([0, 4, ["1", "2", "3", "4"]]);
});

test("test calling top of a queue", () => {
    expect(
        head(([0, 1, ["1"]] as Queue<unknown>))
    ).toStrictEqual("1");

    expect(
        head(([0, 2, ["2", "1"]] as Queue<unknown>))
    ).toStrictEqual("2");

    expect(
        head(([0, 3, ["3", "2", "1"]] as Queue<unknown>))
    ).toStrictEqual("3");

    let empty_queue = empty();
    enqueue("1", empty_queue);
    expect(head(empty_queue)).toStrictEqual("1");


    enqueue("2", empty_queue);
    expect(head(empty_queue)).toStrictEqual("1");

    empty_queue = empty();
    enqueue("2", empty_queue);
    enqueue("1", empty_queue);
    expect(head(empty_queue)).toStrictEqual("2");
});

test("test calling pop of a queue", () => {
    let q: Queue<string>;

    q = [0, 1, ["1"]];
    dequeue(q);
    expect(q).toStrictEqual([1, 1, ["1"]]);


    q = [0, 2, ["2", "1"]];
    dequeue(q);
    expect(q).toStrictEqual([1, 2, ["2", "1"]]);


    q = [0, 3, ["3", "2", "1"]];
    dequeue(q);
    expect(q).toStrictEqual([1, 3, ["3", "2", "1"]]);


    q = empty();
    enqueue("1", q);
    dequeue(q);
    expect(q).toStrictEqual([1, 1, ["1"]]);


    q = empty();
    enqueue("1", q);
    enqueue("2", q);
    dequeue(q);
    expect(q).toStrictEqual([1, 2, ["1", "2"]]);


    q = empty();
    enqueue("1", q);
    enqueue("2", q);
    enqueue("3", q);
    dequeue(q);
    expect(q).toStrictEqual([1, 3, ["1", "2", "3"]]);
});

test("test calling display_queue on a queue", () => {
    // replace console.log function
    const console_log_mock = jest.spyOn(console, "log").mockImplementation();

    display_queue(([0, 0, []] as Queue<unknown>));
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith("queue()");

    display_queue(([0, 1, ["1"]] as Queue<unknown>));
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenCalledWith("queue(1)");

    display_queue(([0, 2, ["2", "1"]] as Queue<unknown>));
    expect(console.log).toHaveBeenCalledTimes(3);
    expect(console.log).toHaveBeenCalledWith("queue(2, 1)");

    display_queue(([0, 3, ["3", "2", "1"]] as Queue<unknown>));
    expect(console.log).toHaveBeenCalledTimes(4);
    expect(console.log).toHaveBeenCalledWith("queue(3, 2, 1)");

    // restore original function
    console_log_mock.mockRestore();
});
