import { hash_id, ch_delete, ch_empty,
    ch_insert, ch_keys, ch_lookup, ChainingHashtable,
    probe_linear, probe_double, probe_quadratic,
    ph_delete, ph_empty, ph_insert, ph_keys, ph_lookup,
    ProbingHashtable,
    is_chaining_table,
    is_probing_table } from "../src/hashtables";
import { enum_list, list, pair, to_string } from "../src/list";


/**
 * Test implementation of hashtable
 */
// Test creating tables of diffrent sizes
test.each([
    { // chaining size 1
        type: "chaining",
        func: ch_empty,
        size: 1,
        hash_func: hash_id,
        probe_func: null
    },
    { // chaining size 2
        type: "chaining",
        func: ch_empty,
        size: 2,
        hash_func: hash_id,
        probe_func: null
    },
    { // chaining size 3
        type: "chaining",
        func: ch_empty,
        size: 3,
        hash_func: hash_id,
        probe_func: null
    },
    { // chaining size 4
        type: "chaining",
        func: ch_empty,
        size: 4,
        hash_func: hash_id,
        probe_func: null
    },
    { // linear probe size 1
        type: "linear probe",
        func: ph_empty,
        size: 1,
        hash_func: null,
        probe_type: probe_linear(hash_id)
    },
    { // linear probe size 2
        type: "linear probe",
        func: ph_empty,
        size: 2,
        hash_func: null,
        probe_type: probe_linear(hash_id)
    },
    { // linear probe size 3
        type: "linear probe",
        func: ph_empty,
        size: 3,
        hash_func: null,
        probe_type: probe_linear(hash_id)
    },
    { // linear probe size 4
        type: "linear probe",
        func: ph_empty,
        size: 4,
        hash_func: null,
        probe_type: probe_linear(hash_id)
    },
    { // double probe size 1
        type: "double probe",
        func: ph_empty,
        size: 1,
        hash_func: null,
        probe_type: probe_double(
            hash_id,
            (id: number) => ((127 - id) * (127 - id)) + (127 - id)
        )
    },
    { // double probe size 2
        type: "double probe",
        func: ph_empty,
        size: 2,
        hash_func: null,
        probe_type: probe_double(
            hash_id,
            (id: number) => ((127 - id) * (127 - id)) + (127 - id)
        )
    },
    { // double probe size 3
        type: "double probe",
        func: ph_empty,
        size: 3,
        hash_func: null,
        probe_type: probe_double(
            hash_id,
            (id: number) => ((127 - id) * (127 - id)) + (127 - id)
        )
    },
    { // double probe size 4
        type: "double probe",
        func: ph_empty,
        size: 4,
        hash_func: null,
        probe_type: probe_double(
            hash_id,
            (id: number) => ((127 - id) * (127 - id)) + (127 - id)
        )
    },
    { // quadratic probe size 1
        type: "quadratic probe",
        func: ph_empty,
        size: 1,
        hash_func: null,
        probe_type: probe_quadratic(hash_id)
    },
    { // quadratic probe size 2
        type: "quadratic probe",
        func: ph_empty,
        size: 2,
        hash_func: null,
        probe_type: probe_quadratic(hash_id)
    },
    { // quadratic probe size 3 NOT RECOMENDED: DOES NOT HANDEL COLLISSIONS
        type: "quadratic probe",
        func: ph_empty,
        size: 3,
        hash_func: null,
        probe_type: probe_quadratic(hash_id)
    },
    { // quadratic probe size 4
        type: "quadratic probe",
        func: ph_empty,
        size: 4,
        hash_func: null,
        probe_type: probe_quadratic(hash_id)
    }
])(
    "Test creating a $type hastable with length $size",
    ({ func, size, hash_func, probe_type }) => {
        let table;
        if (func.name === ch_empty.name) {
            table = (func(
                size,
                hash_func === null
                    ? fail()
                    : hash_func
            ) as ChainingHashtable<number, any>);
            expect(table)
                .toStrictEqual({
                    arr: Array(size).fill(null),
                    hash: hash_func
                });
        } else if (
            func.name === ph_empty.name
            && probe_type !== undefined
        ) {
            table = (func(
                size,
                probe_type === null
                    ? fail()
                    : probe_type
            ) as ProbingHashtable<number, any>);
            expect(table)
                .toStrictEqual({
                    keys: Array(size),
                    data: Array(size),
                    size: 0,
                    probe: probe_type
                });
        }
    }
);

// Test inserating elements into tables without collision
test.each([
    { // Chaining size 1: insert 1 element
        type: "chaining",
        table: ch_empty(1, hash_id),
        elements: [
            { key: 0, data: "1" }
        ],
        expected: [

            // arr
            [
                list(pair(0, "1"))
            ]
        ]
    },
    { // Chaining size 2: insert 2 elements
        type: "chaining",
        table: ch_empty(2, hash_id),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "1" }
        ],
        expected: [

            // arr
            [
                list(pair(0, "1")),
                list(pair(1, "1"))
            ]
        ]
    },
    { // Chaining size 3: insert 3 elements
        type: "chaining",
        table: ch_empty(3, hash_id),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "1" },
            { key: 2, data: "1" }
        ],
        expected: [

            // arr
            [
                list(pair(0, "1")),
                list(pair(1, "1")),
                list(pair(2, "1"))
            ]
        ]
    },
    { // Chaining size 4: insert 4 elements
        type: "chaining",
        table: ch_empty(4, hash_id),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "1" },
            { key: 2, data: "1" },
            { key: 3, data: "1" }
        ],
        expected: [

            // arr
            [
                list(pair(0, "1")),
                list(pair(1, "1")),
                list(pair(2, "1")),
                list(pair(3, "1"))
            ]
        ]
    },
    { // linear probe size 1: insert 1 element
        type: "linear probe",
        table: ph_empty(1, probe_linear(hash_id)),
        elements: [
            { key: 0, data: "1" }
        ],
        expected: [

            // keys
            [0],

            // data
            ["1"],

            // size
            1
        ]
    },
    { // linear probe size 2: insert 2 elements
        type: "linear probe",
        table: ph_empty(2, probe_linear(hash_id)),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "1" }
        ],
        expected: [

            // keys
            [0, 1],

            // data
            ["1", "1"],

            // size
            2
        ]
    },
    { // linear probe size 3: insert 3 elements
        type: "linear probe",
        table: ph_empty(3, probe_linear(hash_id)),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "1" },
            { key: 2, data: "1" }
        ],
        expected: [

            // keys
            [0, 1, 2],

            // data
            ["1", "1", "1"],

            // size
            3
        ]
    },
    { // linear probe size 4: insert 4 elements
        type: "linear probe",
        table: ph_empty(4, probe_linear(hash_id)),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "1" },
            { key: 2, data: "1" },
            { key: 3, data: "1" }
        ],
        expected: [

            // keys
            [0, 1, 2, 3],

            // data
            ["1", "1", "1", "1"],

            // size
            4
        ]
    },
    { // double probe size 1: insert 1 element
        type: "double probe",
        table: ph_empty(1, probe_double(
            () => 0,
            hash_id
        )),
        elements: [
            { key: 0, data: "1" }
        ],
        expected: [

            // keys
            [0],

            // data
            ["1"],

            // size
            1
        ]
    },
    { // double probe size 2: insert 2 elements
        type: "double probe",
        table: ph_empty(2, probe_double(
            () => 0,
            hash_id
        )),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "1" }
        ],
        expected: [

            // keys
            [0, 1],

            // data
            ["1", "1"],

            // size
            2
        ]
    },
    { // double probe size 3: insert 3 elements
        type: "double probe",
        table: ph_empty(3, probe_double(
            () => 0,
            hash_id
        )),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "1" },
            { key: 2, data: "1" }
        ],
        expected: [

            // keys
            [0, 1, 2],

            // data
            ["1", "1", "1"],

            // size
            3
        ]
    },
    { // double probe size 4: insert 4 elements
        type: "double probe",
        table: ph_empty(4, probe_double(
            () => 0,
            hash_id
        )),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "1" },
            { key: 2, data: "1" },
            { key: 3, data: "1" }
        ],
        expected: [

            // keys
            [0, 1, 2, 3],

            // data
            ["1", "1", "1", "1"],

            // size
            4
        ]
    },
    { // quadratic probe size 1: insert 1 element
        type: "quadratic probe",
        table: ph_empty(1, probe_quadratic(hash_id)),
        elements: [
            { key: 0, data: "1" }
        ],
        expected: [

            // keys
            [0],

            // data
            ["1"],

            // size
            1
        ]
    },
    { // quadratic probe size 2: insert 2 elements
        type: "quadratic probe",
        table: ph_empty(2, probe_quadratic(hash_id)),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "1" }
        ],
        expected: [

            // keys
            [0, 1],

            // data
            ["1", "1"],

            // size
            2
        ]
    },
    { // quadratic probe size 3: insert 3 elements
        type: "quadratic probe",
        table: ph_empty(3, probe_quadratic(hash_id)),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "1" },
            { key: 2, data: "1" }
        ],
        expected: [

            // keys
            [0, 1, 2],

            // data
            ["1", "1", "1"],

            // size
            3
        ]
    },
    { // quadratic probe size 4: insert 4 elements
        type: "quadratic probe",
        table: ph_empty(4, probe_quadratic(hash_id)),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "1" },
            { key: 2, data: "1" },
            { key: 3, data: "1" }
        ],
        expected: [

            // keys
            [0, 1, 2, 3],

            // data
            ["1", "1", "1", "1"],

            // size
            4
        ]
    }
])(
    "Test inserting $elements.length number of elements into a $type hastable",
    ({ table, elements, expected }) => {
        if (is_chaining_table(table)) {
            // get insert function for table
            const insert_func = ch_insert;
            elements.forEach((element) => {
                insert_func(table, element.key, element.data);
            });
            expect(table).toHaveProperty("arr", expected[0]);
        } else if (is_probing_table(table)) {
            // get insert function for table
            const insert_func = ph_insert;
            elements.forEach((element) => {
                insert_func(table, element.key, element.data);
            });
            expect(table).toHaveProperty("keys", expected[0]);
            expect(table).toHaveProperty("data", expected[1]);
            expect(table).toHaveProperty("size", expected[2]);
        } else {
            fail();
        }
    }
);

// Test inserating elements into tables with collisions
test.each([
    { // Chaining size 8: insert 4 elements with diffrent keys
        type: "chaining",
        table: ch_empty(8, () => 0),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 2, data: "3" },
            { key: 3, data: "4" }
        ],
        expected: [

            // arr
            [   // collisions are appended in the front of list
                list(pair(3, "4"), pair(2, "3"), pair(1, "2"), pair(0, "1")),
                list(),
                list(),
                list(),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },
    { // Chaining size 8: insert 2 sets of 2 elements with same key
        type: "chaining",
        table: ch_empty(8, () => 0),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 0, data: "3" },
            { key: 1, data: "4" }
        ],
        expected: [

            // arr
            [
                list(pair(1, "4"), pair(0, "3")),
                list(),
                list(),
                list(),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },
    { // Chaining size 8: insert 9 elements
        type: "chaining",
        table: ch_empty(8, () => 0),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 2, data: "3" },
            { key: 3, data: "4" },
            { key: 4, data: "5" },
            { key: 5, data: "6" },
            { key: 6, data: "7" },
            { key: 7, data: "8" },
            { key: 8, data: "9" }
        ],
        expected: [

            // arr
            [
                list(
                    pair(8, "9"),
                    pair(7, "8"),
                    pair(6, "7"),
                    pair(5, "6"),
                    pair(4, "5"),
                    pair(3, "4"),
                    pair(2, "3"),
                    pair(1, "2"),
                    pair(0, "1")
                ),
                list(),
                list(),
                list(),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },
    { // Chaining size 8: insert 9 elements and replace first 4
        type: "chaining",
        table: ch_empty(8, () => 0),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 2, data: "3" },
            { key: 3, data: "4" },
            { key: 4, data: "5" },
            { key: 5, data: "6" },
            { key: 6, data: "7" },
            { key: 7, data: "8" },
            { key: 8, data: "9" },
            { key: 0, data: "10" },
            { key: 1, data: "11" },
            { key: 2, data: "12" },
            { key: 3, data: "13" }
        ],
        expected: [

            // arr
            [
                list(
                    pair(8, "9"),
                    pair(7, "8"),
                    pair(6, "7"),
                    pair(5, "6"),
                    pair(4, "5"),
                    pair(3, "13"),
                    pair(2, "12"),
                    pair(1, "11"),
                    pair(0, "10")
                ),
                list(),
                list(),
                list(),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },
    { // linear probe size 8: insert 4 elements with diffrent keys
        type: "linear probe",
        table: ph_empty(8, probe_linear(() => 0)),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 2, data: "3" },
            { key: 3, data: "4" }
        ],
        expected: [

            // keys
            [0, 1, 2, 3, undefined, undefined, undefined, undefined],

            // data
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            4
        ]
    },
    { // linear probe size 8: insert 2 sets of 2 elements with same key
        type: "linear probe",
        table: ph_empty(8, probe_linear(() => 0)),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 0, data: "3" },
            { key: 1, data: "4" }
        ],
        expected: [

            // keys
            [
                0,
                1,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // data
            [
                "3",
                "4",
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // size
            2
        ]
    },
    { // linear probe size 8: insert 9 elements
        type: "linear probe",
        table: ph_empty(8, probe_linear(() => 0)),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 2, data: "3" },
            { key: 3, data: "4" },
            { key: 4, data: "5" },
            { key: 5, data: "6" },
            { key: 6, data: "7" },
            { key: 7, data: "8" },
            { key: 8, data: "9" }
        ],
        expected: [

            // keys
            [0, 1, 2, 3, 4, 5, 6, 7],

            // data
            ["1", "2", "3", "4", "5", "6", "7", "8"],

            // size
            8
        ]
    },
    { // linear probe size 8: insert 9 elements and replace first 4
        type: "linear probe",
        table: ph_empty(8, probe_linear(() => 0)),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 2, data: "3" },
            { key: 3, data: "4" },
            { key: 4, data: "5" },
            { key: 5, data: "6" },
            { key: 6, data: "7" },
            { key: 7, data: "8" },
            { key: 8, data: "9" },
            { key: 0, data: "10" },
            { key: 1, data: "11" },
            { key: 2, data: "12" },
            { key: 3, data: "13" }
        ],
        expected: [

            // keys
            [0, 1, 2, 3, 4, 5, 6, 7],

            // data
            ["10", "11", "12", "13", "5", "6", "7", "8"],

            // size
            8
        ]
    },
    { // double probe size 8: insert 4 elements with diffrent keys
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            () => 1
        )),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 2, data: "3" },
            { key: 3, data: "4" }
        ],
        expected: [

            // keys
            [0, 1, 2, 3, undefined, undefined, undefined, undefined],

            // data
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            4
        ]
    },
    { // double probe size 8: insert 2 sets of 2 elements with same key
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            () => 1
        )),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 0, data: "3" },
            { key: 1, data: "4" }
        ],
        expected: [

            // keys
            [
                0,
                1,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // data
            [
                "3",
                "4",
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // size
            2
        ]
    },
    { // double probe size 8: insert 9 elements
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            () => 1
        )),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 2, data: "3" },
            { key: 3, data: "4" },
            { key: 4, data: "5" },
            { key: 5, data: "6" },
            { key: 6, data: "7" },
            { key: 7, data: "8" },
            { key: 8, data: "9" }
        ],
        expected: [

            // keys
            [0, 1, 2, 3, 4, 5, 6, 7],

            // data
            ["1", "2", "3", "4", "5", "6", "7", "8"],

            // size
            8
        ]
    },
    { // double probe size 8: insert 9 elements and replace first 4
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            () => 1
        )),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 2, data: "3" },
            { key: 3, data: "4" },
            { key: 4, data: "5" },
            { key: 5, data: "6" },
            { key: 6, data: "7" },
            { key: 7, data: "8" },
            { key: 8, data: "9" },
            { key: 0, data: "10" },
            { key: 1, data: "11" },
            { key: 2, data: "12" },
            { key: 3, data: "13" }
        ],
        expected: [

            // keys
            [0, 1, 2, 3, 4, 5, 6, 7],

            // data
            ["10", "11", "12", "13", "5", "6", "7", "8"],

            // size
            8
        ]
    },
    { // quadratic probe size 8: insert 4 elements with diffrent keys
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(() => 0)),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 2, data: "3" },
            { key: 3, data: "4" }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 steps right
            // 3:rd is (3^2 + 3)/2 mod 8 = 6 steps right

            // keys
            [0, 1, undefined, 2, undefined, undefined, 3, undefined],

            // data
            ["1", "2", undefined, "3", undefined, undefined, "4", undefined],

            // size
            4
        ]
    },
    { // quadratic probe size 8: insert 2 sets of 2 elements with same key
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(() => 0)),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 0, data: "3" },
            { key: 1, data: "4" }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 steps right
            // 3:rd is (3^2 + 3)/2 mod 8 = 6 steps right

            // keys
            [
                0,
                1,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // data
            [
                "3",
                "4",
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // size
            2
        ]
    },
    { // quadratic probe size 8: insert 9 elements
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(() => 0)),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 2, data: "3" },
            { key: 3, data: "4" },
            { key: 4, data: "5" },
            { key: 5, data: "6" },
            { key: 6, data: "7" },
            { key: 7, data: "8" },
            { key: 8, data: "9" }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 mod 8 = 3 steps right
            // 3rd: is (3^2 + 3)/2 mod 8 = 6 mod 8 = 6 steps right
            // 4th: is (4^2 + 4)/2 mod 8 = 10 mod 8 = 2 steps right
            // 5th: is (5^2 + 5)/2 mod 8 = 15 mod 8 = 7 steps right
            // 6th: is (6^2 + 6)/2 mod 8 = 21 mod 8 = 5 steps right
            // 7th: is (7^2 + 7)/2 mod 8 = 28 mod 8 = 4 steps right
            // 8th: is (8^2 + 8)/2 mod 8 = 72 mod 8 = 0 steps right // looped

            // keys
            [0, 1, 4, 2, 7, 6, 3, 5],

            // data
            ["1", "2", "5", "3", "8", "7", "4", "6"],

            // size
            8
        ]
    },
    { // quadratic probe size 8: insert 9 elements and replace first 4
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(() => 0)),
        elements: [
            { key: 0, data: "1" },
            { key: 1, data: "2" },
            { key: 2, data: "3" },
            { key: 3, data: "4" },
            { key: 4, data: "5" },
            { key: 5, data: "6" },
            { key: 6, data: "7" },
            { key: 7, data: "8" },
            { key: 8, data: "9" },
            { key: 0, data: "10" },
            { key: 1, data: "11" },
            { key: 2, data: "12" },
            { key: 3, data: "13" }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 mod 8 = 3 steps right
            // 3rd: is (3^2 + 3)/2 mod 8 = 6 mod 8 = 6 steps right
            // 4th: is (4^2 + 4)/2 mod 8 = 10 mod 8 = 2 steps right
            // 5th: is (5^2 + 5)/2 mod 8 = 15 mod 8 = 7 steps right
            // 6th: is (6^2 + 6)/2 mod 8 = 21 mod 8 = 5 steps right
            // 7th: is (7^2 + 7)/2 mod 8 = 28 mod 8 = 4 steps right
            // 8th: is (8^2 + 8)/2 mod 8 = 72 mod 8 = 0 steps right // looped

            // keys
            [0, 1, 4, 2, 7, 6, 3, 5],

            // data
            ["10", "11", "5", "12", "8", "7", "13", "6"],

            // size
            8
        ]
    }
])(
    "Test inserting $elements.length number of elements"
    + " into a $type hastable with collisions",
    ({ table, elements, expected }) => {
        if (is_chaining_table(table)) {
            // get insert function for table
            const insert_func = ch_insert;
            elements.forEach((element) => {
                insert_func(table, element.key, element.data);
            });
            expect(table).toHaveProperty("arr", expected[0]);
        } else if (is_probing_table(table)) {
            // get insert function for table
            const insert_func = ph_insert;
            elements.forEach((element) => {
                insert_func(table, element.key, element.data);
            });
            expect(table).toHaveProperty("keys", expected[0]);
            expect(table).toHaveProperty("data", expected[1]);
            expect(table).toHaveProperty("size", expected[2]);
        } else {
            fail();
        }
    }
);

// Test Inserting and deleting elements into tables
test.each([

    // Chaining size 8:
    // insert 4 elements and remove first 3
    {
        type: "chaining",
        table: ch_empty(8, hash_id),
        function_calls: [
            { function: ch_insert, args: [0, "1"] as const },
            { function: ch_insert, args: [1, "2"] as const },
            { function: ch_insert, args: [2, "3"] as const },
            { function: ch_insert, args: [3, "4"] as const },
            { function: ch_delete, args: [0] as const },
            { function: ch_delete, args: [1] as const },
            { function: ch_delete, args: [2] as const },
            { function: ch_delete, args: [2] as const }
        ],
        expected: [

            // arr
            [   // collisions are appended in the front of list
                list(),
                list(),
                list(),
                list(pair(3, "4")),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },

    // Chaining size 8:
    // insert 4 elements and remove first 3
    {
        type: "chaining",
        table: ch_empty(8, hash_id),
        function_calls: [
            { function: ch_insert, args: [0, "1"] as const },
            { function: ch_insert, args: [1, "2"] as const },
            { function: ch_insert, args: [2, "3"] as const },
            { function: ch_insert, args: [3, "4"] as const },
            { function: ch_delete, args: [0] as const },
            { function: ch_delete, args: [1] as const },
            { function: ch_delete, args: [2] as const },
            { function: ch_insert, args: [0, "5"] as const },
            { function: ch_insert, args: [1, "6"] as const },
            { function: ch_insert, args: [2, "7"] as const }
        ],
        expected: [

            // arr
            [   // collisions are appended in the front of list
                list(pair(0, "5")),
                list(pair(1, "6")),
                list(pair(2, "7")),
                list(pair(3, "4")),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },

    // linear probe size 8:
    // insert 4 elements and remove first 3
    {
        type: "linear probe",
        table: ph_empty(8, probe_linear(hash_id)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            { function: ph_delete, args: [0] as const },
            { function: ph_delete, args: [1] as const },
            { function: ph_delete, args: [2] as const },
            { function: ph_delete, args: [2] as const }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [null, null, null, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            1
        ]
    },

    // linear probe size 8:
    // insert 4 elements and remove first 3 then insert 3 new and replace 4th
    {
        type: "linear probe",
        table: ph_empty(8, probe_linear(hash_id)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            { function: ph_delete, args: [0] as const },
            { function: ph_delete, args: [1] as const },
            { function: ph_delete, args: [2] as const },
            { function: ph_insert, args: [3, "8"] as const },
            { function: ph_insert, args: [0, "5"] as const },
            { function: ph_insert, args: [1, "6"] as const },
            { function: ph_insert, args: [2, "7"] as const }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 mod 8 = 3 steps right
            // 3rd: is (3^2 + 3)/2 mod 8 = 6 mod 8 = 6 steps right
            // 4th: is (4^2 + 4)/2 mod 8 = 10 mod 8 = 2 steps right
            // 5th: is (5^2 + 5)/2 mod 8 = 15 mod 8 = 7 steps right
            // 6th: is (6^2 + 6)/2 mod 8 = 21 mod 8 = 5 steps right
            // 7th: is (7^2 + 7)/2 mod 8 = 28 mod 8 = 4 steps right
            // 8th: is (8^2 + 8)/2 mod 8 = 72 mod 8 = 0 steps right // looped

            // keys
            // deleted keys are replaced with null
            [0, 1, 2, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["5", "6", "7", "8", undefined, undefined, undefined, undefined],

            // size
            4
        ]
    },

    // double probe size 8:
    // insert 4 elements and remove first 3
    {
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            hash_id
        )),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            { function: ph_delete, args: [0] as const },
            { function: ph_delete, args: [1] as const },
            { function: ph_delete, args: [2] as const },
            { function: ph_delete, args: [2] as const }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [null, null, null, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            1
        ]
    },

    // double probe size 8:
    // insert 4 elements and remove first 3 then insert 3 new and replace 4th
    {
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            hash_id
        )),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            { function: ph_delete, args: [0] as const },
            { function: ph_delete, args: [1] as const },
            { function: ph_delete, args: [2] as const },
            { function: ph_insert, args: [3, "8"] as const },
            { function: ph_insert, args: [0, "5"] as const },
            { function: ph_insert, args: [1, "6"] as const },
            { function: ph_insert, args: [2, "7"] as const }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [0, 1, 2, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["5", "6", "7", "8", undefined, undefined, undefined, undefined],

            // size
            4
        ]
    },

    // quadratic probe size 8:
    // insert 4 elements and remove first 3
    {
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(hash_id)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            { function: ph_delete, args: [0] as const },
            { function: ph_delete, args: [1] as const },
            { function: ph_delete, args: [2] as const },
            { function: ph_delete, args: [2] as const }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 mod 8 = 3 steps right
            // 3rd: is (3^2 + 3)/2 mod 8 = 6 mod 8 = 6 steps right
            // 4th: is (4^2 + 4)/2 mod 8 = 10 mod 8 = 2 steps right
            // 5th: is (5^2 + 5)/2 mod 8 = 15 mod 8 = 7 steps right
            // 6th: is (6^2 + 6)/2 mod 8 = 21 mod 8 = 5 steps right
            // 7th: is (7^2 + 7)/2 mod 8 = 28 mod 8 = 4 steps right
            // 8th: is (8^2 + 8)/2 mod 8 = 72 mod 8 = 0 steps right // looped

            // keys
            // deleted keys are replaced with null
            [null, null, null, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            1
        ]
    },

    // quadratic probe size 8:
    // insert 4 elements and remove first 3 then insert 3 new and replace 4th
    {
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(hash_id)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            { function: ph_delete, args: [0] as const },
            { function: ph_delete, args: [1] as const },
            { function: ph_delete, args: [2] as const },
            { function: ph_insert, args: [3, "8"] as const },
            { function: ph_insert, args: [0, "5"] as const },
            { function: ph_insert, args: [1, "6"] as const },
            { function: ph_insert, args: [2, "7"] as const }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 mod 8 = 3 steps right
            // 3rd: is (3^2 + 3)/2 mod 8 = 6 mod 8 = 6 steps right
            // 4th: is (4^2 + 4)/2 mod 8 = 10 mod 8 = 2 steps right
            // 5th: is (5^2 + 5)/2 mod 8 = 15 mod 8 = 7 steps right
            // 6th: is (6^2 + 6)/2 mod 8 = 21 mod 8 = 5 steps right
            // 7th: is (7^2 + 7)/2 mod 8 = 28 mod 8 = 4 steps right
            // 8th: is (8^2 + 8)/2 mod 8 = 72 mod 8 = 0 steps right // looped

            // keys
            // deleted keys are replaced with null
            [0, 1, 2, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["5", "6", "7", "8", undefined, undefined, undefined, undefined],

            // size
            4
        ]
    }
])(
    "Test inserting and deleting elements using"
    + " $function_calls.length function calls"
    + " into a $type hastable",
    ({ table, function_calls, expected }) => {
        if (is_chaining_table(table)) {
            function_calls.forEach((function_call) => {
                // @ts-expect-error
                // eslint-disable-next-line @stylistic/max-len
                function_call.function(table, ...function_call.args);
            });
            expect(table).toHaveProperty("arr", expected[0]);
        } else if (is_probing_table(table)) {
            function_calls.forEach((function_call) => {
                // @ts-expect-error
                // eslint-disable-next-line @stylistic/max-len
                function_call.function(table, ...function_call.args);
            });
            expect(table).toHaveProperty("keys", expected[0]);
            expect(table).toHaveProperty("data", expected[1]);
            expect(table).toHaveProperty("size", expected[2]);
        } else {
            fail();
        }
    }
);

// Test Inserting and deleting elements into tables with collision
test.each([


    // Chaining size 8:
    // insert 4 elements and remove first 3
    {
        type: "chaining",
        table: ch_empty(8, () => 0),
        function_calls: [
            { function: ch_insert, args: [0, "1"] },
            { function: ch_insert, args: [1, "2"] },
            { function: ch_insert, args: [2, "3"] },
            { function: ch_insert, args: [3, "4"] },
            { function: ch_delete, args: [0] },
            { function: ch_delete, args: [1] },
            { function: ch_delete, args: [2] }
        ],
        expected: [

            // arr
            [   // collisions are appended in the front of list
                list(pair(3, "4")),
                list(),
                list(),
                list(),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },

    // Chaining size 8:
    // insert 4 elements and remove first 3
    {
        type: "chaining",
        table: ch_empty(8, () => 0),
        function_calls: [
            { function: ch_insert, args: [0, "1"] },
            { function: ch_insert, args: [1, "2"] },
            { function: ch_insert, args: [2, "3"] },
            { function: ch_insert, args: [3, "4"] },
            { function: ch_delete, args: [0] },
            { function: ch_delete, args: [1] },
            { function: ch_delete, args: [2] },
            { function: ch_insert, args: [0, "5"] },
            { function: ch_insert, args: [1, "6"] },
            { function: ch_insert, args: [2, "7"] }
        ],
        expected: [

            // arr
            [   // collisions are appended in the front of list
                list(pair(2, "7"), pair(1, "6"), pair(0, "5"), pair(3, "4")),
                list(),
                list(),
                list(),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },

    // Chaining size 8:
    // insert 4 elements and remove first 3 lookup 4th
    {
        type: "Chaining",
        table: ch_empty(8, () => 0),
        function_calls: [
            { function: ch_insert, args: [0, "1"] },
            { function: ch_insert, args: [1, "2"] },
            { function: ch_insert, args: [2, "3"] },
            { function: ch_insert, args: [3, "4"] },
            { function: ch_delete, args: [0] },
            { function: ch_delete, args: [1] },
            { function: ch_delete, args: [2] },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // arr
            [   // collisions are appended in the front of list
                list(pair(3, "4")),
                list(),
                list(),
                list(),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },

    // linear probe size 8:
    // insert 4 elements and remove first 3
    {
        type: "linear probe",
        table: ph_empty(8, probe_linear(() => 0)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] },
            { function: ph_insert, args: [1, "2"] },
            { function: ph_insert, args: [2, "3"] },
            { function: ph_insert, args: [3, "4"] },
            { function: ph_delete, args: [0] },
            { function: ph_delete, args: [1] },
            { function: ph_delete, args: [2] }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [null, null, null, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            1
        ]
    },

    // linear probe size 8:
    // insert 4 elements and remove first 3 then insert 3 new
    {
        type: "linear probe",
        table: ph_empty(8, probe_linear(() => 0)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] },
            { function: ph_insert, args: [1, "2"] },
            { function: ph_insert, args: [2, "3"] },
            { function: ph_insert, args: [3, "4"] },
            { function: ph_delete, args: [0] },
            { function: ph_delete, args: [1] },
            { function: ph_delete, args: [2] },
            { function: ph_insert, args: [0, "5"] },
            { function: ph_insert, args: [1, "6"] },
            { function: ph_insert, args: [2, "7"] }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 mod 8 = 3 steps right
            // 3rd: is (3^2 + 3)/2 mod 8 = 6 mod 8 = 6 steps right
            // 4th: is (4^2 + 4)/2 mod 8 = 10 mod 8 = 2 steps right
            // 5th: is (5^2 + 5)/2 mod 8 = 15 mod 8 = 7 steps right
            // 6th: is (6^2 + 6)/2 mod 8 = 21 mod 8 = 5 steps right
            // 7th: is (7^2 + 7)/2 mod 8 = 28 mod 8 = 4 steps right
            // 8th: is (8^2 + 8)/2 mod 8 = 72 mod 8 = 0 steps right // looped

            // keys
            // deleted keys are replaced with null
            [0, 1, 2, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["5", "6", "7", "4", undefined, undefined, undefined, undefined],

            // size
            4
        ]
    },

    // linear probe size 8:
    // insert 4 elements and remove first 3 lookup 4th
    {
        type: "linear probe",
        table: ph_empty(8, probe_linear(() => 0)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] },
            { function: ph_insert, args: [1, "2"] },
            { function: ph_insert, args: [2, "3"] },
            { function: ph_insert, args: [3, "4"] },
            { function: ph_delete, args: [0] },
            { function: ph_delete, args: [1] },
            { function: ph_delete, args: [2] },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 mod 8 = 3 steps right
            // 3rd: is (3^2 + 3)/2 mod 8 = 6 mod 8 = 6 steps right
            // 4th: is (4^2 + 4)/2 mod 8 = 10 mod 8 = 2 steps right
            // 5th: is (5^2 + 5)/2 mod 8 = 15 mod 8 = 7 steps right
            // 6th: is (6^2 + 6)/2 mod 8 = 21 mod 8 = 5 steps right
            // 7th: is (7^2 + 7)/2 mod 8 = 28 mod 8 = 4 steps right
            // 8th: is (8^2 + 8)/2 mod 8 = 72 mod 8 = 0 steps right // looped

            // keys
            // deleted keys are replaced with null
            [null, null, null, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            1
        ]
    },

    // double probe size 8:
    // insert 4 elements and remove first 3
    {
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            () => 1
        )),
        function_calls: [
            { function: ph_insert, args: [0, "1"] },
            { function: ph_insert, args: [1, "2"] },
            { function: ph_insert, args: [2, "3"] },
            { function: ph_insert, args: [3, "4"] },
            { function: ph_delete, args: [0] },
            { function: ph_delete, args: [1] },
            { function: ph_delete, args: [2] }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [null, null, null, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            1
        ]
    },

    // double probe size 8:
    // insert 4 elements and remove first 3 then insert 3 new
    {
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            () => 1
        )),
        function_calls: [
            { function: ph_insert, args: [0, "1"] },
            { function: ph_insert, args: [1, "2"] },
            { function: ph_insert, args: [2, "3"] },
            { function: ph_insert, args: [3, "4"] },
            { function: ph_delete, args: [0] },
            { function: ph_delete, args: [1] },
            { function: ph_delete, args: [2] },
            { function: ph_insert, args: [0, "5"] },
            { function: ph_insert, args: [1, "6"] },
            { function: ph_insert, args: [2, "7"] }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [0, 1, 2, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["5", "6", "7", "4", undefined, undefined, undefined, undefined],

            // size
            4
        ]
    },

    // double probe size 8:
    // insert 4 elements and remove first 3 lookup 4th
    {
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            () => 1
        )),
        function_calls: [
            { function: ph_insert, args: [0, "1"] },
            { function: ph_insert, args: [1, "2"] },
            { function: ph_insert, args: [2, "3"] },
            { function: ph_insert, args: [3, "4"] },
            { function: ph_delete, args: [0] },
            { function: ph_delete, args: [1] },
            { function: ph_delete, args: [2] },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 mod 8 = 3 steps right
            // 3rd: is (3^2 + 3)/2 mod 8 = 6 mod 8 = 6 steps right
            // 4th: is (4^2 + 4)/2 mod 8 = 10 mod 8 = 2 steps right
            // 5th: is (5^2 + 5)/2 mod 8 = 15 mod 8 = 7 steps right
            // 6th: is (6^2 + 6)/2 mod 8 = 21 mod 8 = 5 steps right
            // 7th: is (7^2 + 7)/2 mod 8 = 28 mod 8 = 4 steps right
            // 8th: is (8^2 + 8)/2 mod 8 = 72 mod 8 = 0 steps right // looped

            // keys
            // deleted keys are replaced with null
            [null, null, null, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            1
        ]
    },

    // quadratic probe size 8:
    // insert 4 elements and remove first 3
    {
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(() => 0)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] },
            { function: ph_insert, args: [1, "2"] },
            { function: ph_insert, args: [2, "3"] },
            { function: ph_insert, args: [3, "4"] },
            { function: ph_delete, args: [0] },
            { function: ph_delete, args: [1] },
            { function: ph_delete, args: [2] }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 mod 8 = 3 steps right
            // 3rd: is (3^2 + 3)/2 mod 8 = 6 mod 8 = 6 steps right
            // 4th: is (4^2 + 4)/2 mod 8 = 10 mod 8 = 2 steps right
            // 5th: is (5^2 + 5)/2 mod 8 = 15 mod 8 = 7 steps right
            // 6th: is (6^2 + 6)/2 mod 8 = 21 mod 8 = 5 steps right
            // 7th: is (7^2 + 7)/2 mod 8 = 28 mod 8 = 4 steps right
            // 8th: is (8^2 + 8)/2 mod 8 = 72 mod 8 = 0 steps right // looped

            // keys
            // deleted keys are replaced with null
            [null, null, undefined, null, undefined, undefined, 3, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", undefined, "3", undefined, undefined, "4", undefined],

            // size
            1
        ]
    },

    // quadratic probe size 8:
    // insert 4 elements and remove first 3 then insert 3 new
    {
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(() => 0)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] },
            { function: ph_insert, args: [1, "2"] },
            { function: ph_insert, args: [2, "3"] },
            { function: ph_insert, args: [3, "4"] },
            { function: ph_delete, args: [0] },
            { function: ph_delete, args: [1] },
            { function: ph_delete, args: [2] },
            { function: ph_insert, args: [0, "5"] },
            { function: ph_insert, args: [1, "6"] },
            { function: ph_insert, args: [2, "7"] }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 mod 8 = 3 steps right
            // 3rd: is (3^2 + 3)/2 mod 8 = 6 mod 8 = 6 steps right
            // 4th: is (4^2 + 4)/2 mod 8 = 10 mod 8 = 2 steps right
            // 5th: is (5^2 + 5)/2 mod 8 = 15 mod 8 = 7 steps right
            // 6th: is (6^2 + 6)/2 mod 8 = 21 mod 8 = 5 steps right
            // 7th: is (7^2 + 7)/2 mod 8 = 28 mod 8 = 4 steps right
            // 8th: is (8^2 + 8)/2 mod 8 = 72 mod 8 = 0 steps right // looped

            // keys
            // deleted keys are replaced with null
            [0, 1, undefined, 2, undefined, undefined, 3, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["5", "6", undefined, "7", undefined, undefined, "4", undefined],

            // size
            4
        ]
    },

    // quadratic probe size 8:
    // insert 4 elements and remove first 3 lookup 4th
    {
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(() => 0)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] },
            { function: ph_insert, args: [1, "2"] },
            { function: ph_insert, args: [2, "3"] },
            { function: ph_insert, args: [3, "4"] },
            { function: ph_delete, args: [0] },
            { function: ph_delete, args: [1] },
            { function: ph_delete, args: [2] },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 mod 8 = 3 steps right
            // 3rd: is (3^2 + 3)/2 mod 8 = 6 mod 8 = 6 steps right
            // 4th: is (4^2 + 4)/2 mod 8 = 10 mod 8 = 2 steps right
            // 5th: is (5^2 + 5)/2 mod 8 = 15 mod 8 = 7 steps right
            // 6th: is (6^2 + 6)/2 mod 8 = 21 mod 8 = 5 steps right
            // 7th: is (7^2 + 7)/2 mod 8 = 28 mod 8 = 4 steps right
            // 8th: is (8^2 + 8)/2 mod 8 = 72 mod 8 = 0 steps right // looped

            // keys
            // deleted keys are replaced with null
            [null, null, undefined, null, undefined, undefined, 3, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", undefined, "3", undefined, undefined, "4", undefined],

            // size
            1
        ]
    }
])(
    "Test inserting and deleting elements using"
    + " $function_calls.length function calls"
    + " into a $type hastable with collision",
    ({ table, function_calls, expected }) => {
        if (is_chaining_table(table)) {
            function_calls.forEach((function_call) => {
                // @ts-expect-error
                // eslint-disable-next-line @stylistic/max-len
                function_call.function(table, ...function_call.args);
            });
            expect(table).toHaveProperty("arr", expected[0]);
        } else if (is_probing_table(table)) {
            function_calls.forEach((function_call) => {
                // @ts-expect-error
                // eslint-disable-next-line @stylistic/max-len
                function_call.function(table, ...function_call.args);
            });
            expect(table).toHaveProperty("keys", expected[0]);
            expect(table).toHaveProperty("data", expected[1]);
            expect(table).toHaveProperty("size", expected[2]);
        } else {
            fail();
        }
    }
);

// Test lookup after inserting and deleting elements into a table
test.each([

    // Chaining size 8:
    // insert 4 elements and look them up
    {
        type: "chaining",
        table: ch_empty(8, hash_id),
        function_calls: [
            { function: ch_insert, args: [0, "1"] },
            { function: ch_insert, args: [1, "2"] },
            { function: ch_insert, args: [2, "3"] },
            { function: ch_insert, args: [3, "4"] },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [1, "2"]
            },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [2, "3"]
            },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // arr
            [   // collisions are appended in the front of list
                list(pair(0, "1")),
                list(pair(1, "2")),
                list(pair(2, "3")),
                list(pair(3, "4")),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },

    // Chaining size 8:
    // insert 4 elements and remove first 3 then look them all up
    {
        type: "chaining",
        table: ch_empty(8, hash_id),
        function_calls: [
            { function: ch_insert, args: [0, "1"] },
            { function: ch_insert, args: [1, "2"] },
            { function: ch_insert, args: [2, "3"] },
            { function: ch_insert, args: [3, "4"] },
            { function: ch_delete, args: [0] },
            { function: ch_delete, args: [1] },
            { function: ch_delete, args: [2] },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [1, undefined]
            },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [2, undefined]
            },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // arr
            [   // collisions are appended in the front of list
                list(),
                list(),
                list(),
                list(pair(3, "4")),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },

    // Chaining size 8:
    // look it up a element, insert it, look it up, delete it, look it up.
    {
        type: "Chaining",
        table: ch_empty(8, hash_id),
        function_calls: [
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: ch_insert, args: [0, "1"]
            },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: ch_delete, args: [0]
            },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            }
        ],
        expected: [

            // arr
            [   // collisions are appended in the front of list
                list(),
                list(),
                list(),
                list(),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },

    // linear probe size 8:
    // insert 4 elements and look them up
    {
        type: "linear probe",
        table: ph_empty(8, probe_linear(hash_id)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [1, "2"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [2, "3"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [0, 1, 2, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            4
        ]
    },

    // linear probe size 8:
    // insert 4 element and remove first 3 then look them all up
    {
        type: "linear probe",
        table: ph_empty(8, probe_linear(hash_id)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            { function: ph_delete, args: [0] as const },
            { function: ph_delete, args: [1] as const },
            { function: ph_delete, args: [2] as const },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [1, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [2, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [null, null, null, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            1
        ]
    },

    // linear probe size 8:
    // look it up a element, insert it, look it up, delete it, look it up.
    {
        type: "linear probe",
        table: ph_empty(8, probe_linear(hash_id)),
        function_calls: [
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: ph_insert, args: [0, "1"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: ph_delete, args: [0]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [
                null,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            [
                "1",
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // size
            0
        ]
    },

    // double probe size 8:
    // insert 4 elements and look them up
    {
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            hash_id
        )),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [1, "2"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [2, "3"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [0, 1, 2, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            4
        ]
    },

    // double probe size 8:
    // insert 4 element and remove first 3 then look them all up
    {
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            hash_id
        )),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            { function: ph_delete, args: [0] as const },
            { function: ph_delete, args: [1] as const },
            { function: ph_delete, args: [2] as const },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [1, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [2, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [null, null, null, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            1
        ]
    },

    // double probe size 8:
    // look it up a element, insert it, look it up, delete it, look it up.
    {
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            hash_id
        )),
        function_calls: [
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: ph_insert, args: [0, "1"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: ph_delete, args: [0]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [
                null,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            [
                "1",
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // size
            0
        ]
    },

    // quadratic probe size 8:
    // insert 4 elements and look them up
    {
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(hash_id)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [1, "2"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [2, "3"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [0, 1, 2, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            4
        ]
    },

    // quadratic probe size 8:
    // insert 4 element and remove first 3 then look them all up
    {
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(hash_id)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            { function: ph_delete, args: [0] as const },
            { function: ph_delete, args: [1] as const },
            { function: ph_delete, args: [2] as const },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [1, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [2, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [null, null, null, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            1
        ]
    },

    // quadratic probe size 8:
    // look it up a element, insert it, look it up, delete it, look it up.
    {
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(hash_id)),
        function_calls: [
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: ph_insert, args: [0, "1"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: ph_delete, args: [0]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [
                null,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            [
                "1",
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // size
            0
        ]
    }
])(
    "Test lookup after inserting and deleting elements using"
    + " $function_calls.length function calls"
    + " into a $type hastable",
    ({ table, function_calls, expected }) => {
        if (is_chaining_table(table)) {
            function_calls.forEach((function_call) => {
                // @ts-expect-error
                // eslint-disable-next-line @stylistic/max-len
                function_call.function(table, ...function_call.args);
            });
            expect(table).toHaveProperty("arr", expected[0]);
        } else if (is_probing_table(table)) {
            function_calls.forEach((function_call) => {
                // @ts-expect-error
                // eslint-disable-next-line @stylistic/max-len
                function_call.function(table, ...function_call.args);
            });
            expect(table).toHaveProperty("keys", expected[0]);
            expect(table).toHaveProperty("data", expected[1]);
            expect(table).toHaveProperty("size", expected[2]);
        } else {
            fail();
        }
    }
);

// Test lookup after inserting and deleting elements into a table with collision
test.each([

    // Chaining size 8:
    // insert 4 elements and look them up
    {
        type: "chaining",
        table: ch_empty(8, () => 0),
        function_calls: [
            { function: ch_insert, args: [0, "1"] },
            { function: ch_insert, args: [1, "2"] },
            { function: ch_insert, args: [2, "3"] },
            { function: ch_insert, args: [3, "4"] },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [1, "2"]
            },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [2, "3"]
            },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // arr
            [   // collisions are appended in the front of list
                list(pair(3, "4"), pair(2, "3"), pair(1, "2"), pair(0, "1")),
                list(),
                list(),
                list(),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },

    // Chaining size 8:
    // insert 4 elements and remove first 3 then look them all up
    {
        type: "chaining",
        table: ch_empty(8, () => 0),
        function_calls: [
            { function: ch_insert, args: [0, "1"] },
            { function: ch_insert, args: [1, "2"] },
            { function: ch_insert, args: [2, "3"] },
            { function: ch_insert, args: [3, "4"] },
            { function: ch_delete, args: [0] },
            { function: ch_delete, args: [1] },
            { function: ch_delete, args: [2] },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [1, undefined]
            },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [2, undefined]
            },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // arr
            [   // collisions are appended in the front of list
                list(pair(3, "4")),
                list(),
                list(),
                list(),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },

    // Chaining size 8:
    // look it up a element, insert it, look it up, delete it, look it up.
    {
        type: "Chaining",
        table: ch_empty(8, () => 0),
        function_calls: [
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            { function: ch_insert, args: [0, "1"] },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            { function: ch_delete, args: [0] },
            {
                function: (
                    table: ChainingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ch_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            }
        ],
        expected: [

            // arr
            [   // collisions are appended in the front of list
                list(),
                list(),
                list(),
                list(),
                list(),
                list(),
                list(),
                list()
            ]
        ]
    },

    // linear probe size 8:
    // insert 4 element and look them up
    {
        type: "linear probe",
        table: ph_empty(8, probe_linear(() => 0)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [1, "2"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [2, "3"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [0, 1, 2, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            4
        ]
    },

    // linear probe size 8:
    // insert 4 element and remove first 3 then look them all up
    {
        type: "linear probe",
        table: ph_empty(8, probe_linear(() => 0)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            { function: ph_delete, args: [0] as const },
            { function: ph_delete, args: [1] as const },
            { function: ph_delete, args: [2] as const },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [1, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [2, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [null, null, null, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            1
        ]
    },

    // linear probe size 8:
    // look it up a element, insert it, look it up, delete it, look it up.
    {
        type: "linear probe",
        table: ph_empty(8, probe_linear(() => 0)),
        function_calls: [
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: ph_insert, args: [0, "1"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: ph_delete, args: [0]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [
                null,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            [
                "1",
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // size
            0
        ]
    },

    // double probe size 8:
    // insert 4 element and look them up
    {
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            () => 1
        )),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [1, "2"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [2, "3"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [0, 1, 2, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            4
        ]
    },

    // double probe size 8:
    // insert 4 element and remove first 3 then look them all up
    {
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            () => 1
        )),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            { function: ph_delete, args: [0] as const },
            { function: ph_delete, args: [1] as const },
            { function: ph_delete, args: [2] as const },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [1, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [2, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [null, null, null, 3, undefined, undefined, undefined, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", "3", "4", undefined, undefined, undefined, undefined],

            // size
            1
        ]
    },

    // double probe size 8:
    // look it up a element, insert it, look it up, delete it, look it up.
    {
        type: "double probe",
        table: ph_empty(8, probe_double(
            () => 0,
            () => 1
        )),
        function_calls: [
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: ph_insert, args: [0, "1"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: ph_delete, args: [0]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [
                null,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            [
                "1",
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // size
            0
        ]
    },

    // quadratic probe size 8:
    // insert 4 element and look them up
    {
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(() => 0)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [1, "2"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [2, "3"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 mod 8 = 3 steps right
            // 3rd: is (3^2 + 3)/2 mod 8 = 6 mod 8 = 6 steps right
            // 4th: is (4^2 + 4)/2 mod 8 = 10 mod 8 = 2 steps right
            // 5th: is (5^2 + 5)/2 mod 8 = 15 mod 8 = 7 steps right
            // 6th: is (6^2 + 6)/2 mod 8 = 21 mod 8 = 5 steps right
            // 7th: is (7^2 + 7)/2 mod 8 = 28 mod 8 = 4 steps right
            // 8th: is (8^2 + 8)/2 mod 8 = 72 mod 8 = 0 steps right // looped

            // keys
            // deleted keys are replaced with null
            [0, 1, undefined, 2, undefined, undefined, 3, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", undefined, "3", undefined, undefined, "4", undefined],

            // size
            4
        ]
    },

    // quadratic probe size 8:
    // insert 4 element and remove first 3 then look them all up
    {
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(() => 0)),
        function_calls: [
            { function: ph_insert, args: [0, "1"] as const },
            { function: ph_insert, args: [1, "2"] as const },
            { function: ph_insert, args: [2, "3"] as const },
            { function: ph_insert, args: [3, "4"] as const },
            { function: ph_delete, args: [0] as const },
            { function: ph_delete, args: [1] as const },
            { function: ph_delete, args: [2] as const },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [1, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [2, undefined]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [3, "4"]
            }
        ],
        expected: [

            // each collision moves ((i^2 + i) / 2) mod 8
            // 1st: is (1^2 + 1)/2 mod 8 = 1 mod 8 = 1 step rigth
            // 2nd: is (2^2 + 2)/2 mod 8 = 3 mod 8 = 3 steps right
            // 3rd: is (3^2 + 3)/2 mod 8 = 6 mod 8 = 6 steps right
            // 4th: is (4^2 + 4)/2 mod 8 = 10 mod 8 = 2 steps right
            // 5th: is (5^2 + 5)/2 mod 8 = 15 mod 8 = 7 steps right
            // 6th: is (6^2 + 6)/2 mod 8 = 21 mod 8 = 5 steps right
            // 7th: is (7^2 + 7)/2 mod 8 = 28 mod 8 = 4 steps right
            // 8th: is (8^2 + 8)/2 mod 8 = 72 mod 8 = 0 steps right // looped

            // keys
            // deleted keys are replaced with null
            [null, null, undefined, null, undefined, undefined, 3, undefined],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            ["1", "2", undefined, "3", undefined, undefined, "4", undefined],

            // size
            1
        ]
    },

    // quadratic probe size 8:
    // look it up a element, insert it, look it up, delete it, look it up.
    {
        type: "quadratic probe",
        table: ph_empty(8, probe_quadratic(() => 0)),
        function_calls: [
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            },
            {
                function: ph_insert, args: [0, "1"]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, "1"]
            },
            {
                function: ph_delete, args: [0]
            },
            {
                function: (
                    table: ProbingHashtable<unknown, unknown>,
                    key: unknown,
                    data: unknown
                ): void => expect(ph_lookup(table, key)).toEqual(data),
                args: [0, undefined]
            }
        ],
        expected: [

            // keys
            // deleted keys are replaced with null
            [
                null,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // data
            // data never gets deleted
            // only replaced when new values are inserted.
            [
                "1",
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined
            ],

            // size
            0
        ]
    }
])(
    "Test lookup after inserting and deleting elements using"
    + " $function_calls.length function calls"
    + " into a $type hastable with collision",
    ({ table, function_calls, expected }) => {
        if (is_chaining_table(table)) {
            function_calls.forEach((function_call) => {
                // @ts-expect-error
                // eslint-disable-next-line @stylistic/max-len
                function_call.function(table, ...function_call.args);
            });
            expect(table).toHaveProperty("arr", expected[0]);
        } else if (is_probing_table(table)) {
            function_calls.forEach((function_call) => {
                // @ts-expect-error
                // eslint-disable-next-line @stylistic/max-len
                function_call.function(table, ...function_call.args);
            });
            expect(table).toHaveProperty("keys", expected[0]);
            expect(table).toHaveProperty("data", expected[1]);
            expect(table).toHaveProperty("size", expected[2]);
        } else {
            fail();
        }
    }
);

test("Test ch_keys on a chaining hashtable", () => {
    // insert 100 elements into a table
    // Create table
    let table = ch_empty(
        128,
        (id: number) => Math.abs(id)
    );

    // Insert
    for (let index = 0; index < 100; index++) {
        ch_insert(
            table,
            index,
            {
                key: index,
                data: Math.random() * index
            }
        );
    }

    // lookup
    for (let index = 0; index < 100; index++) {
        expect(ch_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }

    expect(to_string(ch_keys(table)))
        .toBe(to_string(enum_list(0, 99)));
});

test("Test ph_keys on a linear probe hashtable", () => {
    // insert 100 elements into a table
    // Create table
    let table = ph_empty(
        128,
        probe_linear(hash_id)
    );

    // Insert
    for (let index = 0; index < 100; index++) {
        ph_insert(
            table,
            index,
            {
                key: index,
                data: Math.random() * index
            }
        );
    }

    // lookup
    for (let index = 0; index < 100; index++) {
        expect(ph_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }

    expect(to_string(ph_keys(table)))
        .toBe(to_string(enum_list(0, 99)));
});

test("Test ph_keys on a quadratic probe hashtable", () => {
    // insert 100 elements into a table
    let table = ph_empty(
        128,
        probe_quadratic(hash_id)
    );
    for (let index = 0; index < 100; index++) {
        ph_insert(
            table,
            index,
            {
                key: index,
                data: Math.random() * index
            }
        );
    }

    // lookup 100 elements into a table
    for (let index = 0; index < 100; index++) {
        expect(ph_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }

    expect(to_string(ph_keys(table)))
        .toBe(to_string(enum_list(0, 99)));
});
