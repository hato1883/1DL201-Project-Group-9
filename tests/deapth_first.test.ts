import { lg_depth_first } from "../src/deapth_first";
import { ListGraph } from "../src/graphs";
import { list, head, tail, is_null } from "../src/list";
import { Stream, Result } from "../src/path";
import { queue } from "../src/queue_array";


const a = 0;
const b = 1;
const c = 2;
const d = 3;
const e = 4;
const f = 5;
const g = 6;
const h = 7;
const listgraph: ListGraph = {
    adj: [
        list(b, d), // A: 0
        list(c, f), // B: 1
        list(g), // C: 2
        list(c, e, g), // D: 3
        list(g), // E: 4
        list(e, h), // F: 5
        list(), // G: 6
        list(g) // H: 7
    ],
    size: 8
};

function eval_stream(stream: Stream<Result>): Result {
    let return_value = stream;
    while (!head(return_value).is_done) {
        let stream_tail = tail(return_value);
        if (!is_null(stream_tail)) {
            return_value = stream_tail();
        } else {
            return head(return_value);
        }
    }
    return head(return_value);
}


test("test listgraph depth first search", () => {
    let result = eval_stream(
        lg_depth_first(
            {
                adj:
                    [
                        list(b),
                        list(a)
                    ],
                size: 2
            } as ListGraph,
            a,
            b
        )
    );
    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, b)
    );


    result = eval_stream(
        lg_depth_first(
            {
                adj:
                    [
                        list(b),
                        list(c),
                        list(a)
                    ],
                size: 3
            } as ListGraph,
            a,
            c
        )
    );
    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, b, c)
    );


    result = eval_stream(
        lg_depth_first(
            {
                adj:
                    [
                        list(b),
                        list(c),
                        list(a)
                    ],
                size: 3
            } as ListGraph,
            b,
            c
        )
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(b, c)
    );


    result = eval_stream(
        lg_depth_first(
            {
                adj:
                    [
                        list(b),
                        list(c),
                        list()
                    ],
                size: 3
            } as ListGraph,
            c,
            b
        )
    );
    expect(
        result.path_so_far
    ).toStrictEqual(
        queue()
    );


    result = eval_stream(
        lg_depth_first(
            {
                adj:
                    [
                        list(b),
                        list(c, a),
                        list(a, b)
                    ],
                size: 3
            } as ListGraph,
            c,
            b
        )
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(c, b)
    );


    result = eval_stream(
        lg_depth_first(
            {
                adj:
                    [
                        list(b),
                        list(c, d),
                        list(e),
                        list(e),
                        list()
                    ],
                size: 5
            } as ListGraph,
            a,
            e
        )
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, b, d, e)
    );


    result = eval_stream(
        lg_depth_first(
            {
                adj:
                    [
                        list(b),
                        list(c, d),
                        list(e, f),
                        list(e),
                        list(f),
                        list()
                    ],
                size: 6
            } as ListGraph,
            a,
            f
        )
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, b, d, e, f)
    );


    result = eval_stream(
        lg_depth_first(
            {
                adj:
                    [
                        list(b),
                        list(c, d),
                        list(e),
                        list(e, f),
                        list(f),
                        list()
                    ],
                size: 6
            } as ListGraph,
            a,
            f
        )
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, b, d, f)
    );


    result = eval_stream(
        lg_depth_first(
            {
                adj:
                    [
                        list(b, f),
                        list(c),
                        list(b),
                        list(c),
                        list(d),
                        list(e)
                    ],
                size: 6
            } as ListGraph,
            a,
            c
        )
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, f, e, d, c)
    );


    result = eval_stream(
        lg_depth_first(
            {
                adj:
                    [
                        list(f, b),
                        list(c),
                        list(b),
                        list(c),
                        list(d),
                        list(e)
                    ],
                size: 6
            } as ListGraph,
            a,
            c
        )
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, b, c)
    );


    result = eval_stream(
        lg_depth_first(listgraph, a, g)
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, d, g)
    );


    result = eval_stream(
        lg_depth_first(listgraph, a, h)
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, b, f, h)
    );


    result = eval_stream(
        lg_depth_first(listgraph, a, c)
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, d, c)
    );


    result = eval_stream(
        lg_depth_first(listgraph, a, e)
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, d, e)
    );
});
