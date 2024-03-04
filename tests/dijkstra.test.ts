import { lg_dijkstra_path } from "../src/dijkstra";
import { ListGraph } from "../src/graphs";
import { list, head, tail, is_null } from "../src/list";
import { new_maze, maze_to_listgraph } from "../src/maze";
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

// Same path as BFS
test("test listgraph dijkstra_path search", () => {
    let result: Result = eval_stream(
        lg_dijkstra_path(
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
        lg_dijkstra_path(
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
        lg_dijkstra_path(
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
        lg_dijkstra_path(
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
        lg_dijkstra_path(
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
        lg_dijkstra_path(
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
        queue(a, b, c, e)
    );


    result = eval_stream(
        lg_dijkstra_path(
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
        queue(a, b, c, f)
    );


    result = eval_stream(
        lg_dijkstra_path(
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
        lg_dijkstra_path(listgraph, a, g)
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, d, g)
    );


    result = eval_stream(
        lg_dijkstra_path(listgraph, a, h)
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, b, f, h)
    );


    result = eval_stream(
        lg_dijkstra_path(listgraph, a, c)
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, b, c)
    );


    result = eval_stream(
        lg_dijkstra_path(listgraph, a, e)
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(a, d, e)
    );


    let maze = new_maze(3);
    maze.matrix[0][1] = false;
    maze.matrix[1][1] = false;
    maze.matrix[2][1] = false;
    result = eval_stream(
        lg_dijkstra_path(
            maze_to_listgraph(maze),
            0,
            8
        )
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue()
    );
});
