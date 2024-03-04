import {
    undirected, EdgeList,
    MatrixGraph, ListGraph,
    mg_from_edges, mg_new, Node,
    lg_from_edges, lg_new, lg_transpose, create_path
} from "../src/graphs";
import { list } from "../src/list";
import { queue } from "../src/queue_array";


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

test("Creating a path given a previous_nodes array", () => {
    let prev = Array<Node>(1);
    expect(create_path(0, 0, prev)).toStrictEqual([0, 1, [0]]);
    expect(create_path(0, 0, prev)).toStrictEqual(queue(0));


    prev = Array<Node>(2);
    prev[1] = 0;
    expect(create_path(0, 1, prev)).toStrictEqual([0, 2, [0, 1]]);
    expect(create_path(0, 1, prev)).toStrictEqual(queue(0, 1));


    prev = Array<Node>(3);
    prev[1] = 0;
    prev[2] = 1;
    expect(create_path(0, 2, prev)).toStrictEqual([0, 3, [0, 1, 2]]);
    expect(create_path(0, 2, prev)).toStrictEqual(queue(0, 1, 2));


    prev = Array<Node>(3);
    prev[1] = 0;
    prev[2] = 1;
    prev[3] = 2;
    expect(create_path(0, 3, prev)).toStrictEqual([0, 4, [0, 1, 2, 3]]);
    expect(create_path(0, 3, prev)).toStrictEqual(queue(0, 1, 2, 3));
});
