import {
    Queue, NonEmptyQueue,
    empty, is_empty, dequeue,
    head, enqueue, display_queue, queue
} from "../src/queue_immutable";


/**
 * Test implementation of queue
 */
test("test creating a empty queue", () => {
    expect(empty()).toStrictEqual(null);
});

test("test creating a non empty queue", () => {
    expect(queue(1, 2)).toStrictEqual([1, [2, null]] as Queue<number>);

    expect(head(queue(1, 2) as NonEmptyQueue<number>))
        .toStrictEqual(1);

    expect(dequeue(queue(1, 2) as NonEmptyQueue<number>))
        .toStrictEqual([2, null] as Queue<number>);


    expect(queue(1, 2, 3, 4))
        .toStrictEqual([1, [2, [3, [4, null]]]] as Queue<number>);

    expect(head(queue(1, 2, 3, 4) as NonEmptyQueue<number>))
        .toStrictEqual(1);
    expect(dequeue(queue(1, 2, 3, 4) as NonEmptyQueue<number>))

        .toStrictEqual([2, [3, [4, null]]] as Queue<number>);
});
const empty_queue = empty();

test("test if queue is empty", () => {
    expect(is_empty(empty())).toBeTruthy();
    expect(is_empty((null as Queue<unknown>))).toBeTruthy();
    expect(is_empty(null)).toBeTruthy();
    expect(is_empty(([null, null] as NonEmptyQueue<unknown>))).toBeFalsy();
    expect(is_empty((["1", null] as NonEmptyQueue<string>))).toBeFalsy();
    expect(is_empty(([1, null] as NonEmptyQueue<number>))).toBeFalsy();
    expect(
        is_empty(([{ id: 1 }, null] as NonEmptyQueue<{ id: number }>))
    ).toBeFalsy();
});

test("test pushing item to queue", () => {
    expect(enqueue("1", empty_queue)).toStrictEqual(["1", null]);

    expect(
        enqueue("2", enqueue("1", empty_queue))
    ).toStrictEqual(["1", ["2", null]]);

    expect(
        enqueue("3", enqueue("2", enqueue("1", empty_queue)))
    ).toStrictEqual(["1", ["2", ["3", null]]]);

    expect(
        enqueue("4", (["1", ["2", ["3", null]]] as NonEmptyQueue<unknown>))
    ).toStrictEqual(["1", ["2", ["3", ["4", null]]]]);
});

test("test calling top of a queue", () => {
    expect(
        head((["1", null] as NonEmptyQueue<unknown>))
    ).toStrictEqual("1");

    expect(
        head((["2", ["1", null]] as NonEmptyQueue<unknown>))
    ).toStrictEqual("2");

    expect(
        head((["3", ["2", ["1", null]]] as NonEmptyQueue<unknown>))
    ).toStrictEqual("3");

    expect(
        head(enqueue("1", empty<string>()) as NonEmptyQueue<string>)
    ).toStrictEqual("1");

    expect(
        head(enqueue("2", enqueue("1", empty())) as NonEmptyQueue<string>)
    ).toStrictEqual("1");

    expect(
        head(enqueue("1", enqueue("2", empty())) as NonEmptyQueue<string>)
    ).toStrictEqual("2");
});

test("test calling pop of a queue", () => {
    expect(
        dequeue((["1", null] as NonEmptyQueue<unknown>))
    ).toStrictEqual(null);

    expect(
        dequeue((["2", ["1", null]] as NonEmptyQueue<unknown>))
    ).toStrictEqual(["1", null]);

    expect(
        dequeue((["3", ["2", ["1", null]]] as NonEmptyQueue<unknown>))
    ).toStrictEqual(["2", ["1", null]]);

    expect(
        dequeue(enqueue("1", empty()) as NonEmptyQueue<string>)
    ).toStrictEqual(null);

    expect(
        dequeue(enqueue("2", enqueue("1", empty())) as NonEmptyQueue<string>)
    ).toStrictEqual(["2", null]);
    expect(
        dequeue(
            enqueue(
                "3",
                enqueue(
                    "2",
                    enqueue(
                        "1",
                        empty()
                    )
                )
            ) as NonEmptyQueue<string>
        )
    ).toStrictEqual(["2", ["3", null]]);
});

test("test calling display_queue on a queue", () => {
    // replace console.log function
    const console_log_mock = jest.spyOn(console, "log").mockImplementation();

    display_queue((null as Queue<unknown>));
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith("queue()");

    display_queue((["1", null] as Queue<unknown>));
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenCalledWith("queue(1)");

    display_queue((["2", ["1", null]] as Queue<unknown>));
    expect(console.log).toHaveBeenCalledTimes(3);
    expect(console.log).toHaveBeenCalledWith("queue(2, 1)");

    display_queue((["3", ["2", ["1", null]]] as Queue<unknown>));
    expect(console.log).toHaveBeenCalledTimes(4);
    expect(console.log).toHaveBeenCalledWith("queue(3, 2, 1)");

    // restore original function
    console_log_mock.mockRestore();
});
