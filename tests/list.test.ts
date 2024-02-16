import * as list from "../src/list";


/**
 * Test implementation of list
 */
test("test creating a pair", () => {
    expect(list.pair("a", "b").toString).toBe(["a", "b"].toString);
});

test("test taking the head of a pair", () => {
    expect(list.head(list.pair("a", "b"))).toBe("a");
});

test("test taking the tail of a pair", () => {
    expect(list.tail(list.pair("a", "b"))).toBe("b");
});

test("test list is_null method ", () => {
    expect(list.is_null(null)).toBeTruthy();
    expect(list.is_null("abc")).toBeFalsy();
});

test("test if a empty list is null", () => {
    expect(list.list()).toBe(null);
    expect(list.is_null(list.list())).toBeTruthy();
});

test("test list's to_string method", () => {
    expect(list.to_string(list.list())).toBe("list()");
    expect(list.to_string(list.list("a"))).toBe("list(a)");
    expect(list.to_string(list.list("a", "b", "c"))).toBe("list(a, b, c)");
});

test("test list's length method", () => {
    expect(list.length(list.list())).toBe(0);
    expect(list.length(list.list("a", "b", "c"))).toBe(3);
});

test("test list's map method", () => {
    let result = list.map(() => 0, list.list(1, 2, 3));
    if (list.is_null(result)) {
        fail();
    } else {
        expect(list.head(result)).toBe(0);
        let tail = list.tail(result);
        if (list.is_null(tail)) {
            fail();
        } else {
            expect(list.head(tail)).toBe(0);
            tail = list.tail(tail);
            if (list.is_null(tail)) {
                fail();
            } else {
                expect(list.head(tail)).toBe(0);
            }
        }
    }


    result = list.map((input) => -input, list.list(-1, -2, -3));
    if (list.is_null(result)) {
        fail();
    } else {
        expect(list.head(result)).toBe(1);
        let tail = list.tail(result);
        if (list.is_null(tail)) {
            fail();
        } else {
            expect(list.head(tail)).toBe(2);
            tail = list.tail(tail);
            if (list.is_null(tail)) {
                fail();
            } else {
                expect(list.head(tail)).toBe(3);
            }
        }
    }
});

test("test list's build_list method", () => {
    let result = list.build_list(() => 0, 3);
    if (list.is_null(result)) {
        fail();
    } else {
        expect(list.head(result)).toBe(0);
        let tail = list.tail(result);
        if (list.is_null(tail)) {
            fail();
        } else {
            expect(list.head(tail)).toBe(0);
            tail = list.tail(tail);
            if (list.is_null(tail)) {
                fail();
            } else {
                expect(list.head(tail)).toBe(0);
            }
        }
    }


    result = list.build_list((index) => -(index + 1), 3);
    if (list.is_null(result)) {
        fail();
    } else {
        expect(list.head(result)).toBe(-1);
        let tail = list.tail(result);
        if (list.is_null(tail)) {
            fail();
        } else {
            expect(list.head(tail)).toBe(-2);
            tail = list.tail(tail);
            if (list.is_null(tail)) {
                fail();
            } else {
                expect(list.head(tail)).toBe(-3);
            }
        }
    }
});

test("test list's for_each method", () => {
    let result = list.build_list(() => 0, 3);
    list.for_each((item) => expect(item).toBe(0), result);


    result = list.build_list((index) => -(index + 1), 3);
    let index = -1;
    list.for_each((item) => {
        expect(item).toBe(index);
        index--;
    }, result);
});

test("test list's reverse method", () => {
    let result = list.build_list((index) => -(index + 1), 3);
    result = list.reverse(result);
    let index = -3;
    list.for_each((item) => {
        expect(item).toBe(index);
        index++;
    }, result);
});

test("test list's append method", () => {
    let result = list.build_list((index) => -(index + 1), 3);
    let result_2 = list.build_list((index) => -(index + 4), 3);
    result = list.append(result, result_2);
    let index = -1;
    list.for_each((item) => {
        expect(item).toBe(index);
        index--;
    }, result);
});

test("test list's member method", () => {
    let result = list.build_list((index) => -(index + 1), 3);
    for (let index = 0; index < list.length(result); index++) {
        expect(list.member(-(index + 1), result)).toBeTruthy();
    }
    result = null;
    expect(list.member(1, result)).toBeNull();
});

test("test list's remove method", () => {
    let result = list.build_list((index) => -(index + 1), 3);
    result = list.remove(-2, result);
    expect(list.to_string(result)).toBe("list(-1, -3)");

    result = list.remove(-2, result);
    expect(list.to_string(result)).toBe("list(-1, -3)");
});

test("test list's remove_all method", () => {
    let result = list.build_list((index) => -(index + 1), 3);
    result = list.remove_all(-2, result);
    expect(list.to_string(result)).toBe("list(-1, -3)");

    result = list.build_list(() => 0, 3);
    result = list.remove_all(0, result);
    expect(list.to_string(result)).toBe("list()");
});

test("test list's filter method", () => {
    let result = list.build_list((index) => index % 2, 4);
    result = list.filter((item) => item === 0, result);
    expect(list.to_string(result)).toBe("list(0, 0)");

    result = list.build_list((index) => index, 4);
    result = list.filter((item) => item % 2 === 0, result);
    expect(list.to_string(result)).toBe("list(0, 2)");
});

test("test list's all method", () => {
    let result = list.build_list((index) => index % 2, 4);
    expect(list.all((item) => item >= 0, result)).toBeTruthy();

    result = list.build_list((index) => index, 4);
    expect(list.all((item) => item % 2 === 0, result)).toBeFalsy();
});

test("test list's enum_list method", () => {
    let result = list.enum_list(0, 4);
    expect(list.to_string(result)).toBe("list(0, 1, 2, 3, 4)");

    result = list.enum_list(-2, 1);
    expect(list.to_string(result)).toBe("list(-2, -1, 0, 1)");
});

test("test list's list_ref method", () => {
    let result = list.enum_list(0, 4);
    expect(list.list_ref(result, 2)).toBe(2);

    result = list.enum_list(-2, 1);
    expect(list.list_ref(result, 3)).toBe(1);

    result = null;
    expect(list.list_ref(result, 3)).toBeUndefined();
});

test("test list's accumulate method", () => {
    let result = list.enum_list(0, 4);
    expect(list.accumulate(
        (element, sum) => element + sum,
        0,
        result
    )).toBe(10);

    expect(list.accumulate(
        (element, sum) => element + sum,
        10,
        result
    )).toBe(20);
});

test("test list's fold_left method", () => {
    let result = list.enum_list(0, 4);
    expect(list.fold_left(
        (element, sum) => element + sum,
        0,
        result
    )).toBe(10);

    expect(list.fold_left(
        (element, sum) => element + sum,
        10,
        result
    )).toBe(20);
});

test("test list's fallten method", () => {
    let result = list.list(list.enum_list(0, 4), list.enum_list(5, 6));
    expect(list.to_string(list.flatten(result)))
        .toBe("list(0, 1, 2, 3, 4, 5, 6)");
});
