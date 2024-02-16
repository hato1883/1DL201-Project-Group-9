import * as hs_table from "../src/hashtables";
import { enum_list, to_string } from "../src/list";


/**
 * Test implementation of hashtable
 */
test("Test creating a chaining hashtable", () => {
    // Test a table of unknown with Object keys
    let table = hs_table.ch_empty(
        1,
        hs_table.hash_id
    );

    expect(table)
        .toMatchObject<hs_table.ChainingHashtable<number, unknown>>;

    // Test a table of Objects with Object keys
    table = hs_table.ch_empty<number, Object>(
        1,
        hs_table.hash_id
    );

    expect(table)
        .toMatchObject<hs_table.ChainingHashtable<number, Object>>;
});

test("Test creating a linear probe hashtable", () => {
    // Create a linear probe
    const probe = hs_table.probe_linear(hs_table.hash_id);

    expect(probe)
        .toMatchObject<hs_table.ProbingFunction<number>>;

    // Test a table of unknown with Object keys
    let table = hs_table.ph_empty(
        1,
        probe
    );

    expect(table)
        .toMatchObject<hs_table.ProbingHashtable<number, unknown>>;

    // Test a table of Objects with Object keys
    table = hs_table.ph_empty<number, Object>(
        1,
        probe
    );

    expect(table)
        .toMatchObject<hs_table.ProbingHashtable<number, Object>>;
});

test("Test creating a double probe hashtable", () => {
    // Create a double hash probe
    const probe = hs_table.probe_double(
        hs_table.hash_id,
        (id: number) => ((127 - id) * (127 - id)) + (127 - id)
    );

    expect(probe)
        .toMatchObject<hs_table.ProbingFunction<Object>>;

    // Test a table of unknown with Object keys
    let table = hs_table.ph_empty(
        1,
        probe
    );

    expect(table)
        .toMatchObject<hs_table.ProbingHashtable<Object, unknown>>;

    // Test a table of Objects with Object keys
    table = hs_table.ph_empty<number, Object>(
        1,
        probe
    );

    expect(table)
        .toMatchObject<hs_table.ProbingHashtable<number, Object>>;
});

test("Test creating a quadratic probe hashtable", () => {
    // Create a quadratic probe
    const probe = hs_table.probe_quadratic(hs_table.hash_id);

    expect(probe)
        .toMatchObject<hs_table.ProbingFunction<Object>>;

    // Test a table of unknown with Object keys
    let table = hs_table.ph_empty(
        1,
        probe
    );

    expect(table)
        .toMatchObject<hs_table.ProbingHashtable<Object, unknown>>;

    // Test a table of Objects with Object keys
    table = hs_table.ph_empty<number, Object>(
        1,
        probe
    );

    expect(table)
        .toMatchObject<hs_table.ProbingHashtable<number, Object>>;
});

test("Test insertion of a chaining hashtable", () => {
    // Create a Hash table
    let table = hs_table.ch_empty(
        1,
        hs_table.hash_id
    );

    const our_object = { key: 1 };

    // Insert to hash table
    hs_table.ch_insert(table, our_object.key, our_object);

    // Look up our object that was inserted
    let result = hs_table.ch_lookup(table, our_object.key);
    expect(result).toBe(our_object);

    // New object with same key which should replace old
    const other_object = { key: 1, other: "hello" };

    // Insert to hash table
    hs_table.ch_insert(table, other_object.key, other_object);

    // Look up our key that was inserted
    // and expect it to have updated the old value
    result = hs_table.ch_lookup(table, our_object.key);
    expect(result).toBe(other_object);
    result = hs_table.ch_lookup(table, other_object.key);
    expect(result).toBe(other_object);

    // insert 100 elements into a table
    // Create table
    table = hs_table.ch_empty(
        128,
        (id: number) => Math.abs(id)
    );

    // Insert
    for (let index = -10; index < 100; index++) {
        hs_table.ch_insert(
            table,
            index,
            {
                key: index,
                data: Math.random() * index
            }
        );
    }

    // lookup
    for (let index = -10; index < 100; index++) {
        expect(hs_table.ch_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }
});
test("Test replace of a chaining hashtable", () => {
    // Create a Hash table
    let table = hs_table.ch_empty(
        1,
        (id: number) => Math.abs(id)
    );

    const our_object = { key: 1 };
    const our_object_neg = { key: -1 };

    // Insert to hash table
    hs_table.ch_insert(table, our_object.key, our_object);
    hs_table.ch_insert(table, our_object_neg.key, our_object_neg);

    // Look up our object that was inserted
    let result = hs_table.ch_lookup(table, our_object.key);
    expect(result).toBe(our_object);
    result = hs_table.ch_lookup(table, our_object_neg.key);
    expect(result).toBe(our_object_neg);

    // New object with same key which should replace old
    const other_object = { key: 1, other: "hello" };
    const other_object_neg = { key: -1, other: "bye" };

    // Insert to hash table
    hs_table.ch_insert(table, other_object.key, other_object);
    hs_table.ch_insert(table, other_object_neg.key, other_object_neg);

    // Look up our key that was inserted
    // and expect it to have updated the old value
    result = hs_table.ch_lookup(table, our_object.key);
    expect(result).toBe(other_object);
    result = hs_table.ch_lookup(table, other_object.key);
    expect(result).toBe(other_object);

    result = hs_table.ch_lookup(table, our_object_neg.key);
    expect(result).toBe(other_object_neg);
    result = hs_table.ch_lookup(table, other_object_neg.key);
    expect(result).toBe(other_object_neg);

    // insert 100 elements into a table
    // Create table
    table = hs_table.ch_empty(
        128,
        (id: number) => Math.abs(id)
    );

    // Insert
    for (let index = -10; index < 100; index++) {
        hs_table.ch_insert(
            table,
            index,
            {
                key: index,
                data: Math.random() * index
            }
        );
    }

    // lookup
    for (let index = -10; index < 100; index++) {
        expect(hs_table.ch_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }
});

test("Test insertion of a linear probe hashtable", () => {
    // Create a Hash table
    let table = hs_table.ph_empty(
        1,
        hs_table.probe_linear(hs_table.hash_id)
    );

    const our_object = { key: 1 };

    // Insert to hash table
    hs_table.ph_insert(table, our_object.key, our_object);

    // Look up our object that was inserted
    let result = hs_table.ph_lookup(table, our_object.key);
    expect(result).toBe(our_object);

    // New object with same key which should replace old
    const other_object = { key: 1, other: "hello" };

    // Insert to hash table
    hs_table.ph_insert(table, other_object.key, other_object);

    // Look up our key that was inserted
    // and expect it to have updated the old value
    result = hs_table.ph_lookup(table, our_object.key);
    expect(result).toBe(other_object);
    result = hs_table.ph_lookup(table, other_object.key);
    expect(result).toBe(other_object);

    // insert 100 elements into a table
    // Create table
    table = hs_table.ph_empty(
        128,
        hs_table.probe_linear(hs_table.hash_id)
    );

    // Insert
    for (let index = 0; index < 100; index++) {
        hs_table.ph_insert(
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
        expect(hs_table.ph_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }
});

test("Test insertion of a double probe hashtable", () => {
    // Create a Hash table
    let table = hs_table.ph_empty(
        1,
        hs_table.probe_double(
            hs_table.hash_id,
            (id: number) => ((127 - id) * (127 - id)) + (127 - id)
        )
    );

    const our_object = { key: 1 };

    // Insert to hash table
    hs_table.ph_insert(table, our_object.key, our_object);

    // Look up our object that was inserted
    let result = hs_table.ph_lookup(table, our_object.key);
    expect(result).toBe(our_object);

    // New object with same key which should replace old
    const other_object = { key: 1, other: "hello" };

    // Insert to hash table
    hs_table.ph_insert(table, other_object.key, other_object);

    // Look up our key that was inserted
    // and expect it to have updated the old value
    result = hs_table.ph_lookup(table, our_object.key);
    expect(result).toBe(other_object);
    result = hs_table.ph_lookup(table, other_object.key);
    expect(result).toBe(other_object);

    // insert 100 elements into a table
    // Create table
    table = hs_table.ph_empty(
        127,
        hs_table.probe_double(
            hs_table.hash_id,
            (id: number) => 127 - id
        )
    );

    // Insert
    for (let index = 0; index < 100; index++) {
        hs_table.ph_insert(
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
        expect(hs_table.ph_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }
});

test("Test insertion of a quadratic probe hashtable", () => {
    // Create a Hash table
    let table = hs_table.ph_empty(
        1,
        hs_table.probe_quadratic(hs_table.hash_id)
    );

    const our_object = { key: 1 };

    // Insert to hash table
    hs_table.ph_insert(table, our_object.key, our_object);

    // Look up our object that was inserted
    let result = hs_table.ph_lookup(table, our_object.key);
    expect(result).toBe(our_object);

    // New object with same key which should replace old
    const other_object = { key: 1, other: "hello" };

    // Insert to hash table
    hs_table.ph_insert(table, other_object.key, other_object);

    // Look up our key that was inserted
    // and expect it to have updated the old value
    result = hs_table.ph_lookup(table, our_object.key);
    expect(result).toBe(other_object);
    result = hs_table.ph_lookup(table, other_object.key);
    expect(result).toBe(other_object);

    // insert 100 elements into a table
    table = hs_table.ph_empty(
        128,
        hs_table.probe_quadratic(hs_table.hash_id)
    );
    for (let index = 0; index < 100; index++) {
        hs_table.ph_insert(
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
        expect(hs_table.ph_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }
});

test("Test deletion in a chaining hashtable", () => {
    // insert 100 elements into a table
    const table = hs_table.ch_empty(
        100,
        hs_table.hash_id
    );

    for (let index = 0; index < 100; index++) {
        // ch_insert() gives ture iff key exist,
        // all keys are unique and should therefore always get false
        expect(hs_table.ch_insert(
            table,
            index,
            {
                key: index,
                data: Math.random() * index
            }
        )).toBeFalsy();
    }

    // lookup 100 elements into a table
    for (let index = 0; index < 100; index++) {
        expect(hs_table.ch_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }


    // Table should have key 0 inside it:
    expect(hs_table.ch_lookup(table, 0)).toBeTruthy();

    // Delete key 0 from table
    expect(hs_table.ch_delete(table, 0)).toBeTruthy();

    // Delete key 0 from table again
    expect(hs_table.ch_delete(table, 0)).toBeFalsy();

    // Table should not have key 0 inside it:
    expect(hs_table.ch_lookup(table, 0)).toBeFalsy();


    // Table should not have key 100 inside it:
    expect(hs_table.ch_lookup(table, 100)).toBeFalsy();

    // insert key 100 to table
    expect(hs_table.ch_insert(table, 100, 100)).toBeFalsy();

    // Table should have key 100 inside it:
    expect(hs_table.ch_lookup(table, 100)).toBeTruthy();
});

test("Test deletion in a linear probe hashtable", () => {
    // insert 100 elements into a table
    const table = hs_table.ph_empty(
        100,
        hs_table.probe_linear(hs_table.hash_id)
    );

    for (let index = 0; index < 100; index++) {
        expect(hs_table.ph_insert(
            table,
            index,
            {
                key: index,
                data: Math.random() * index
            }
        )).toBeTruthy();
    }

    // lookup 100 elements into a table
    for (let index = 0; index < 100; index++) {
        expect(hs_table.ph_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }

    // Table should be full:
    const result = hs_table.ph_insert(table, 100, 100);
    expect(result).toBeFalsy();


    // Table should have key 0 inside it:
    expect(hs_table.ph_lookup(table, 0)).toBeTruthy();

    // Delete key 0 from table
    expect(hs_table.ph_delete(table, 0)).toBeTruthy();

    // Delete key 0 from table again
    expect(hs_table.ph_delete(table, 0)).toBeFalsy();

    // Table should not have key 0 inside it:
    expect(hs_table.ph_lookup(table, 0)).toBeFalsy();


    // Table should not have key 100 inside it:
    expect(hs_table.ph_lookup(table, 100)).toBeFalsy();

    // insert key 100 to table
    expect(hs_table.ph_insert(table, 100, 100)).toBeTruthy();

    // Table should have key 100 inside it:
    expect(hs_table.ph_lookup(table, 100)).toBe(100);


    // Delete key 1 from table
    expect(hs_table.ph_delete(table, 1)).toBeTruthy();

    // insert key 0 to table
    expect(hs_table.ph_insert(table, 0, 0)).toBeTruthy();

    // Delete key 100 from table
    expect(hs_table.ph_delete(table, 100)).toBeTruthy();

    // Update key 0 in table
    expect(hs_table.ph_insert(table, 0, "Hello")).toBeTruthy();
});

test("Test deletion in a double probe hashtable", () => {
    // insert 128 elements into a table
    const table = hs_table.ph_empty(
        127,
        hs_table.probe_double(
            hs_table.hash_id,
            (id: number) => 127 - id
        )
    );

    for (let index = 0; index < 127; index++) {
        expect(hs_table.ph_insert(
            table,
            index,
            {
                key: index,
                data: Math.random() * index
            }
        )).toBeTruthy();
    }

    // lookup 128 elements into a table
    for (let index = 0; index < 127; index++) {
        expect(hs_table.ph_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }

    // Table should be full:
    const result = hs_table.ph_insert(table, 127, 127);
    expect(result).toBeFalsy();


    // Table should have key 0 inside it:
    expect(hs_table.ph_lookup(table, 0)).toBeTruthy();

    // Delete key 0 from table
    expect(hs_table.ph_delete(table, 0)).toBeTruthy();

    // Delete key 0 from table again
    expect(hs_table.ph_delete(table, 0)).toBeFalsy();

    // Table should not have key 0 inside it:
    expect(hs_table.ph_lookup(table, 0)).toBeFalsy();


    // Table should not have key 100 inside it:
    expect(hs_table.ph_lookup(table, 127)).toBeFalsy();

    // insert key 100 to table
    expect(hs_table.ph_insert(table, 127, 127)).toBeTruthy();

    // Table should have key 100 inside it:
    expect(hs_table.ph_lookup(table, 127)).toBeTruthy();
});

test("Test deletion in a quadratic probe hashtable", () => {
    // insert 100 elements into a table
    const table = hs_table.ph_empty(
        100,
        hs_table.probe_quadratic(hs_table.hash_id)
    );

    for (let index = 0; index < 100; index++) {
        expect(hs_table.ph_insert(
            table,
            index,
            {
                key: index,
                data: Math.random() * index
            }
        )).toBeTruthy();
    }

    // lookup 100 elements into a table
    for (let index = 0; index < 100; index++) {
        expect(hs_table.ph_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }

    // Table should be full:
    const result = hs_table.ph_insert(table, 100, 100);
    expect(result).toBeFalsy();


    // Table should have key 0 inside it:
    expect(hs_table.ph_lookup(table, 0)).toBeTruthy();

    // Delete key 0 from table
    expect(hs_table.ph_delete(table, 0)).toBeTruthy();

    // Delete key 0 from table again
    expect(hs_table.ph_delete(table, 0)).toBeFalsy();

    // Table should not have key 0 inside it:
    expect(hs_table.ph_lookup(table, 0)).toBeFalsy();


    // Table should not have key 100 inside it:
    expect(hs_table.ph_lookup(table, 100)).toBeFalsy();

    // insert key 100 to table
    expect(hs_table.ph_insert(table, 100, 100)).toBeTruthy();

    // Table should have key 100 inside it:
    expect(hs_table.ph_lookup(table, 100)).toBeTruthy();
});

test("Test ch_keys on a chaining hashtable", () => {
    // insert 100 elements into a table
    // Create table
    let table = hs_table.ch_empty(
        128,
        (id: number) => Math.abs(id)
    );

    // Insert
    for (let index = 0; index < 100; index++) {
        hs_table.ch_insert(
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
        expect(hs_table.ch_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }

    expect(to_string(hs_table.ch_keys(table)))
        .toBe(to_string(enum_list(0, 99)));
});

test("Test ph_keys on a linear probe hashtable", () => {
    // insert 100 elements into a table
    // Create table
    let table = hs_table.ph_empty(
        128,
        hs_table.probe_linear(hs_table.hash_id)
    );

    // Insert
    for (let index = 0; index < 100; index++) {
        hs_table.ph_insert(
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
        expect(hs_table.ph_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }

    expect(to_string(hs_table.ph_keys(table)))
        .toBe(to_string(enum_list(0, 99)));
});

test("Test ph_keys on a quadratic probe hashtable", () => {
    // insert 100 elements into a table
    let table = hs_table.ph_empty(
        128,
        hs_table.probe_quadratic(hs_table.hash_id)
    );
    for (let index = 0; index < 100; index++) {
        hs_table.ph_insert(
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
        expect(hs_table.ph_lookup(
            table,
            index
        )).toHaveProperty("key", index);
    }

    expect(to_string(hs_table.ph_keys(table)))
        .toBe(to_string(enum_list(0, 99)));
});
