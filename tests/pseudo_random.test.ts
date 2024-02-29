import { splitmix32 } from "../src/pseudo_random";

test("test randomality", () => {
    const random_instance = splitmix32(0);
    let count_true = 0;
    let count_false = 0;
    for (let run = 0; run < 10000; run++) {
        random_instance.random_bool() ? count_true++ : count_false++;
    }
    expect(count_true - count_false).toBeLessThan(100);
});

test("test randomality of float", () => {
    const random_instance = splitmix32(0);
    let greater_than_half = 0;
    let lesser_than_half = 0;
    for (let run = 0; run < 10000; run++) {
        random_instance.random_float() < 0.5
            ? greater_than_half++
            : lesser_than_half++;
    }
    expect(greater_than_half - lesser_than_half).toBeLessThan(100);
});

test("test randomality of int", () => {
    const random_instance = splitmix32(0);
    let count_true = 0;
    let count_false = 0;
    for (let run = 0; run < 10000; run++) {
        random_instance.random_int() ? count_true++ : count_false++;
    }
    expect(count_true - count_false).toBeLessThan(100);
});
