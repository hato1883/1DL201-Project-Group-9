import {
    Stack, NonEmptyStack,
    empty, is_empty, pop,
    top, push, display_stack, stack
} from "../src/stack";


/**
 * Test implementation of Stack
 */
test("test creating a empty stack", () => {
    expect(empty()).toStrictEqual(null);
});

test("test creating a non empty queue", () => {
    expect(stack(1, 2)).toStrictEqual([1, [2, null]] as Stack<number>);

    expect(top(stack(1, 2) as NonEmptyStack<number>))
        .toStrictEqual(1);

    expect(pop(stack(1, 2) as NonEmptyStack<number>))
        .toStrictEqual([2, null] as Stack<number>);


    expect(stack(1, 2, 3, 4))
        .toStrictEqual([1, [2, [3, [4, null]]]] as Stack<number>);

    expect(top(stack(1, 2, 3, 4) as NonEmptyStack<number>))
        .toStrictEqual(1);

    expect(pop(stack(1, 2, 3, 4) as NonEmptyStack<number>))
        .toStrictEqual([2, [3, [4, null]]] as Stack<number>);
});
const empty_stack = empty();

test("test if stack is empty", () => {
    expect(is_empty(empty())).toBeTruthy();
    expect(is_empty((null as Stack<unknown>))).toBeTruthy();
    expect(is_empty(null)).toBeTruthy();
    expect(is_empty(([null, null] as NonEmptyStack<unknown>))).toBeFalsy();
    expect(is_empty((["1", null] as NonEmptyStack<string>))).toBeFalsy();
    expect(is_empty(([1, null] as NonEmptyStack<number>))).toBeFalsy();
    expect(
        is_empty(([{ id: 1 }, null] as NonEmptyStack<{ id: number }>))
    ).toBeFalsy();
});

test("test pushing item to stack", () => {
    expect(push("1", empty_stack)).toStrictEqual(["1", null]);

    expect(push("2", push("1", empty_stack))).toStrictEqual(["2", ["1", null]]);

    expect(
        push("3", push("2", push("1", empty_stack)))
    ).toStrictEqual(["3", ["2", ["1", null]]]);

    expect(
        push("4", (["3", ["2", ["1", null]]] as NonEmptyStack<unknown>))
    ).toStrictEqual(["4", ["3", ["2", ["1", null]]]]);
});

test("test calling top of a stack", () => {
    expect(
        top((["1", null] as NonEmptyStack<unknown>))
    ).toStrictEqual("1");

    expect(
        top((["2", ["1", null]] as NonEmptyStack<unknown>))
    ).toStrictEqual("2");

    expect(
        top((["3", ["2", ["1", null]]] as NonEmptyStack<unknown>))
    ).toStrictEqual("3");

    expect(
        top(push("1", empty()))
    ).toStrictEqual("1");

    expect(
        pop(push("2", push("1", empty())))
    ).toStrictEqual(["1", null]);
});

test("test calling pop of a stack", () => {
    expect(
        pop((["1", null] as NonEmptyStack<unknown>))
    ).toStrictEqual(null);

    expect(
        pop((["2", ["1", null]] as NonEmptyStack<unknown>))
    ).toStrictEqual(["1", null]);

    expect(
        pop((["3", ["2", ["1", null]]] as NonEmptyStack<unknown>))
    ).toStrictEqual(["2", ["1", null]]);

    expect(
        pop(push("1", empty()))
    ).toStrictEqual(null);

    expect(
        pop(push("2", push("1", empty())))
    ).toStrictEqual(["1", null]);
});

test("test calling display_stack on a stack", () => {
    // replace console.log function
    const console_log_mock = jest.spyOn(console, "log").mockImplementation();

    display_stack((null as Stack<unknown>));
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith("stack()");

    display_stack((["1", null] as Stack<unknown>));
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenCalledWith("stack(1)");

    display_stack((["2", ["1", null]] as Stack<unknown>));
    expect(console.log).toHaveBeenCalledTimes(3);
    expect(console.log).toHaveBeenCalledWith("stack(2, 1)");

    display_stack((["3", ["2", ["1", null]]] as Stack<unknown>));
    expect(console.log).toHaveBeenCalledTimes(4);
    expect(console.log).toHaveBeenCalledWith("stack(3, 2, 1)");

    // restore original function
    console_log_mock.mockRestore();
});
