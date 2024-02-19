import {
    undirected, EdgeList,
    MatrixGraph, ListGraph,
    mg_from_edges, mg_new,
    lg_from_edges, lg_new, lg_transpose, lg_breadth_first
} from "../src/graphs";
import { list } from "../src/list";
import { Queue } from "../src/queue_immutable";


/**
 * Test implementation of Stack
 */
test("test creating a empty matrix graph", () => {
    expect(mg_new(0)).toStrictEqual(
        { adj: [], size: 0 }
    );
    expect(mg_new(1)).toStrictEqual(
        { adj: [[false]], size: 1 }
    );
    expect(mg_new(2)).toStrictEqual(
        { adj: [[false, false], [false, false]], size: 2 }
    );
});

test("test creating a empty list graph", () => {
    expect(lg_new(0)).toStrictEqual(
        { adj: [], size: 0 }
    );
    expect(lg_new(1)).toStrictEqual(
        { adj: [list()], size: 1 }
    );
    expect(lg_new(1)).toStrictEqual(
        { adj: [null], size: 1 }
    );
    expect(lg_new(2)).toStrictEqual(
        { adj: [list(), list()], size: 2 }
    );
    expect(lg_new(2)).toStrictEqual(
        { adj: [null, null], size: 2 }
    );
});

const no_edges: EdgeList = list();
const directed_edges: EdgeList = list([0, 1]);
const bi_directional_edges: EdgeList = list([0, 1], [1, 0]);
const cyclic_edges: EdgeList = list([0, 0]);
const five_node_edges_list: EdgeList = list(
    [0, 1],
    [1, 2],
    [1, 3],
    [3, 4],
    [2, 4]
);

test("test creating a matrix graph from edge list", () => {
    expect(
        mg_from_edges(2, no_edges)
    ).toStrictEqual(
        {
            adj:
                [
                    [false, false],
                    [false, false]
                ],
            size: 2
        } as MatrixGraph
    );

    expect(
        mg_from_edges(2, directed_edges)
    ).toStrictEqual(
        {
            adj:
                [
                    [false, true],
                    [false, false]
                ],
            size: 2
        } as MatrixGraph
    );

    expect(
        mg_from_edges(2, bi_directional_edges)
    ).toStrictEqual(
        {
            adj:
                [
                    [false, true],
                    [true, false]
                ],
            size: 2
        } as MatrixGraph
    );

    expect(
        mg_from_edges(2, cyclic_edges)
    ).toStrictEqual(
        {
            adj:
                [
                    [true, false],
                    [false, false]
                ],
            size: 2
        } as MatrixGraph
    );

    expect(
        mg_from_edges(5, five_node_edges_list)
    ).toStrictEqual(
        {
            adj:
            [
                [false, true, false, false, false],
                [false, false, true, true, false],
                [false, false, false, false, true],
                [false, false, false, false, true],
                [false, false, false, false, false]
            ],
            size: 5
        } as MatrixGraph
    );
});

test("test creating a list graph from edge list", () => {
    expect(
        lg_from_edges(2, no_edges)
    ).toStrictEqual(
        {
            adj:
            [
                null,
                null
            ],
            size: 2
        } as ListGraph
    );

    expect(
        lg_from_edges(2, directed_edges)
    ).toStrictEqual(
        {
            adj:
                [
                    list(1),
                    null
                ],
            size: 2
        } as ListGraph
    );

    expect(
        lg_from_edges(2, bi_directional_edges)
    ).toStrictEqual(
        {
            adj:
                [
                    list(1),
                    list(0)
                ],
            size: 2
        } as ListGraph
    );

    expect(
        lg_from_edges(2, cyclic_edges)
    ).toStrictEqual(
        {
            adj:
                [
                    list(0),
                    null
                ],
            size: 2
        } as ListGraph
    );

    expect(
        lg_from_edges(5, five_node_edges_list)
    ).toStrictEqual(
        {
            adj:
                [
                    list(1),
                    list(3, 2),
                    list(4),
                    list(4),
                    list()
                ],
            size: 5
        } as ListGraph
    );
});

test("test creating a matrix graph from undirected edge list", () => {
    expect(
        mg_from_edges(2, undirected(no_edges))
    ).toStrictEqual(
        {
            adj:
                [
                    [false, false],
                    [false, false]
                ],
            size: 2
        } as MatrixGraph
    );

    expect(
        mg_from_edges(2, undirected(directed_edges))
    ).toStrictEqual(
        {
            adj:
                [
                    [false, false],
                    [true, false]
                ],
            size: 2
        } as MatrixGraph
    );

    expect(
        mg_from_edges(2, undirected(bi_directional_edges))
    ).toStrictEqual(
        {
            adj:
                [
                    [false, false],
                    [true, false]
                ],
            size: 2
        } as MatrixGraph
    );

    expect(
        mg_from_edges(2, undirected(cyclic_edges))
    ).toStrictEqual(
        {
            adj:
                [
                    [false, false],
                    [false, false]
                ],
            size: 2
        } as MatrixGraph
    );

    expect(
        mg_from_edges(5, undirected(five_node_edges_list))
    ).toStrictEqual(
        {
            adj:
                [
                    [false, false, false, false, false],
                    [true, false, false, false, false],
                    [false, true, false, false, false],
                    [false, true, false, false, false],
                    [false, false, true, true, false]
                ],
            size: 5
        } as MatrixGraph
    );
});

test("test creating a list graph from edge list", () => {
    expect(
        lg_from_edges(2, undirected(no_edges))
    ).toStrictEqual(
        {
            adj:
                [
                    null,
                    null
                ],
            size: 2
        } as ListGraph
    );
    expect(
        lg_from_edges(2, undirected(directed_edges))
    ).toStrictEqual(
        {
            adj:
                [
                    null,
                    list(0)
                ],
            size: 2
        } as ListGraph
    );

    expect(
        lg_from_edges(2, undirected(bi_directional_edges))
    ).toStrictEqual(
        {
            adj:
                [
                    null,
                    list(0)
                ],
            size: 2
        } as ListGraph
    );

    expect(
        lg_from_edges(2, undirected(cyclic_edges))
    ).toStrictEqual(
        {
            adj:
                [
                    null,
                    null
                ],
            size: 2
        } as ListGraph
    );

    expect(
        lg_from_edges(5, undirected(five_node_edges_list))
    ).toStrictEqual(
        {
            adj:
                [
                    null,
                    list(0),
                    list(1),
                    list(1),
                    list(2, 3)
                ],
            size: 5
        } as ListGraph
    );
});

test("test transposing a list graph", () => {
    expect(
        lg_transpose(
            {
                adj:
                    [
                        null,
                        null
                    ],
                size: 2
            } as ListGraph
        )
    ).toStrictEqual(
        {
            adj:
                [
                    null,
                    null
                ],
            size: 2
        } as ListGraph
    );

    expect(
        lg_transpose(
            {
                adj:
                    [
                        list(1),
                        null
                    ],
                size: 2
            } as ListGraph
        )
    ).toStrictEqual(
        {
            adj:
                [
                    null,
                    list(0)
                ],
            size: 2
        } as ListGraph
    );

    expect(
        lg_transpose(
            {
                adj:
                    [
                        list(1),
                        list(0)
                    ],
                size: 2
            } as ListGraph
        )
    ).toStrictEqual(
        {
            adj:
                [
                    list(1),
                    list(0)
                ],
            size: 2
        } as ListGraph
    );

    expect(
        lg_transpose(
            {
                adj:
                    [
                        list(0),
                        null
                    ],
                size: 2
            } as ListGraph
        )
    ).toStrictEqual(
        {
            adj:
                [
                    list(0),
                    null
                ],
            size: 2
        } as ListGraph
    );

    expect(
        lg_transpose(
            {
                adj:
                    [
                        list(1),
                        list(2, 3),
                        list(4),
                        list(4),
                        list()
                    ],
                size: 5
            } as ListGraph
        )
    ).toStrictEqual(
        {
            adj:
                [
                    list(),
                    list(0),
                    list(1),
                    list(1),
                    list(3, 2)
                ],
            size: 5
        } as ListGraph
    );
});

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

test("test listgraph bfs", () => {
    expect(
        lg_breadth_first(
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
    ).toStrictEqual(
        [a, [b, null]] as Queue<number>
    );

    expect(
        lg_breadth_first(
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
    ).toStrictEqual(
        [a, [b, [c, null]]] as Queue<number>
    );

    expect(
        lg_breadth_first(
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
    ).toStrictEqual(
        [b, [c, null]] as Queue<number>
    );

    expect(
        lg_breadth_first(
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
    ).toStrictEqual(
        null
    );

    expect(
        lg_breadth_first(
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
    ).toStrictEqual(
        [c, [b, null]] as Queue<number>
    );

    expect(
        lg_breadth_first(
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
    ).toStrictEqual(
        [a, [b, [c, [e, null]]]] as Queue<number>
    );

    expect(
        lg_breadth_first(
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
    ).toStrictEqual(
        [a, [b, [c, [f, null]]]] as Queue<number>
    );

    expect(
        lg_breadth_first(
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
    ).toStrictEqual(
        [a, [b, [d, [f, null]]]] as Queue<number>
    );

    expect(
        lg_breadth_first(listgraph, a, g)
    ).toStrictEqual(
        [a, [d, [g, null]]] as Queue<number>
    );

    expect(
        lg_breadth_first(listgraph, a, h)
    ).toStrictEqual(
        [a, [b, [f, [h, null]]]] as Queue<number>
    );

    expect(
        lg_breadth_first(listgraph, a, c)
    ).toStrictEqual(
        [a, [b, [c, null]]] as Queue<number>
    );

    expect(
        lg_breadth_first(listgraph, a, e)
    ).toStrictEqual(
        [a, [d, [e, null]]] as Queue<number>
    );
});
