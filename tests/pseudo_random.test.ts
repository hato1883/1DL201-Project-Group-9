import { splitmix32 } from "../src/pseudo_random";

test("test randomality", () => {
    const random_instance = splitmix32(0);
    let count_true = 0;
    let count_false = 0;
    for (let run = 0; run < 10000; run++) {
        random_instance.random_bool() ? count_true++ : count_false++;
    }
    expect(Math.abs(count_true - count_false)).toBeLessThan(100);
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
    expect(Math.abs(greater_than_half - lesser_than_half)).toBeLessThan(100);
});

test("test randomality of int", () => {
    const random_instance = splitmix32(0);
    let count_true = 0;
    let count_false = 0;
    for (let run = 0; run < 10000; run++) {
        random_instance.random_int() ? count_true++ : count_false++;
    }
    expect(Math.abs(count_true - count_false)).toBeLessThan(100);
});

const max_int32 = 2147483647;
const min_int32 = -2147483648;

const total_random_seeds = 100;
const runs_per_seed = 100;


test(
    "test randomality so that 1 option is picked less than 2/3 of the time",
    () => {
        for (let seed = 0; seed < total_random_seeds; seed++) {
            const random_instance = splitmix32(seed);
            let count_true = 0;
            let count_false = 0;
            for (let run = 0; run < runs_per_seed; run++) {
                random_instance.random_bool() ? count_true++ : count_false++;
            }

            expect(count_true).toBeLessThan(runs_per_seed * (2 / 3));
            expect(count_false).toBeLessThan(runs_per_seed * (2 / 3));
        }
    }
);


test(
    "test that same seed reproduce same results (0-1)",
    () => {
        for (let seeds = 0; seeds < total_random_seeds; seeds++) {
            const random_seed = Math.random() * max_int32;
            let result = Array(1000);
            const instance = splitmix32(random_seed);
            for (let run = 0; run < runs_per_seed; run++) {
                result[run] = instance.random();
            }
            const restarted_instance = splitmix32(random_seed);
            for (let run = 0; run < runs_per_seed; run++) {
                expect(result[run]).toBe(restarted_instance.random());
            }
        }
    }
);


test(
    "test that same seed reproduce same results (true/false)",
    () => {
        for (let seeds = 0; seeds < total_random_seeds; seeds++) {
            const random_seed = Math.random() * max_int32;
            let result = Array(1000);
            const instance = splitmix32(random_seed);
            for (let run = 0; run < runs_per_seed; run++) {
                result[run] = instance.random_bool();
            }
            const restarted_instance = splitmix32(random_seed);
            for (let run = 0; run < runs_per_seed; run++) {
                expect(result[run])
                    .toBe(restarted_instance.random_bool());
            }
        }
    }
);


test(
    "test that same seed reproduce same results (min-max) decimal numbers",
    () => {
        for (let seeds = 0; seeds < total_random_seeds; seeds++) {
            const random_seed = Math.random() * max_int32;
            const min = Math.random() * min_int32;
            const max = Math.random() * max_int32;
            let result = Array(1000);
            const instance = splitmix32(random_seed);
            for (let run = 0; run < runs_per_seed; run++) {
                result[run] = instance.random_float(min, max);
            }
            const restarted_instance = splitmix32(random_seed);
            for (let run = 0; run < runs_per_seed; run++) {
                expect(result[run])
                    .toBe(restarted_instance.random_float(min, max));
            }
        }
    }
);


test(
    "test that same seed reproduce same results (min-max) whole numbers",
    () => {
        for (let seeds = 0; seeds < total_random_seeds; seeds++) {
            const random_seed = Math.random() * max_int32;
            const min = Math.trunc(Math.random() * min_int32);
            const max = Math.trunc(Math.random() * max_int32);
            let result = Array(1000);
            const instance = splitmix32(random_seed);
            for (let run = 0; run < runs_per_seed; run++) {
                result[run] = instance.random_int(min, max);
            }
            const restarted_instance = splitmix32(random_seed);
            for (let run = 0; run < runs_per_seed; run++) {
                expect(result[run])
                    .toBe(restarted_instance.random_int(min, max));
            }
        }
    }
);
