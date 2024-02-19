import {
    undirected, EdgeList,
    MatrixGraph, ListGraph,
    mg_from_edges, mg_new,
    lg_from_edges, lg_new, lg_transpose, lg_bfs
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

test("test listgraph bfs", () => {
    expect(
        lg_bfs(
            {
                adj:
                    [
                        list(1),
                        list(0)
                    ],
                size: 2
            } as ListGraph,
            0,
            1
        )
    ).toStrictEqual(
        [0, [1, null]] as Queue<number>
    );

    expect(
        lg_bfs(
            {
                adj:
                    [
                        list(1),
                        list(2),
                        list(0)
                    ],
                size: 3
            } as ListGraph,
            0,
            2
        )
    ).toStrictEqual(
        [0, [1, [2, null]]] as Queue<number>
    );

    expect(
        lg_bfs(
            {
                adj:
                    [
                        list(1),
                        list(2),
                        list(0)
                    ],
                size: 3
            } as ListGraph,
            1,
            2
        )
    ).toStrictEqual(
        [1, [2, null]] as Queue<number>
    );

    expect(
        lg_bfs(
            {
                adj:
                    [
                        list(1),
                        list(2),
                        list()
                    ],
                size: 3
            } as ListGraph,
            2,
            1
        )
    ).toStrictEqual(
        null
    );

    expect(
        lg_bfs(
            {
                adj:
                    [
                        list(1),
                        list(2, 0),
                        list(0, 1)
                    ],
                size: 3
            } as ListGraph,
            2,
            1
        )
    ).toStrictEqual(
        [2, [1, null]] as Queue<number>
    );

    expect(
        lg_bfs(
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
            } as ListGraph,
            0,
            4
        )
    ).toStrictEqual(
        [0, [1, [2, [4, null]]]] as Queue<number>
    );

    expect(
        lg_bfs(
            {
                adj:
                    [
                        list(1),
                        list(2, 3),
                        list(4, 5),
                        list(4),
                        list(5),
                        list()
                    ],
                size: 6
            } as ListGraph,
            0,
            5
        )
    ).toStrictEqual(
        [0, [1, [2, [5, null]]]] as Queue<number>
    );

    expect(
        lg_bfs(
            {
                adj:
                    [
                        list(1),
                        list(2, 3),
                        list(4),
                        list(4, 5),
                        list(5),
                        list()
                    ],
                size: 6
            } as ListGraph,
            0,
            5
        )
    ).toStrictEqual(
        [0, [1, [3, [5, null]]]] as Queue<number>
    );
});
