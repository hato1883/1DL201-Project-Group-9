import { ListGraph } from "../src/graphs";
import { list } from "../src/list";
import {
    Maze, wall,
    free, new_maze,
    maze_to_listgraph,
    flatten_index,
    deepen_index
} from "../src/maze";


test("Test creating a maze", () => {
    expect(new_maze(1)).toStrictEqual(
        {
            width: 1,
            height: 1,
            matrix: [[free]]
        } as Maze
    );

    expect(new_maze(2)).toStrictEqual(
        {
            width: 2,
            height: 2,
            matrix: [[free, free], [free, free]]
        } as Maze
    );

    expect(new_maze(3)).toStrictEqual(
        {
            width: 3,
            height: 3,
            matrix: [
                [free, free, free],
                [free, free, free],
                [free, free, free]
            ]
        } as Maze
    );

    expect(new_maze(3, wall)).toStrictEqual(
        {
            width: 3,
            height: 3,
            matrix: [
                [wall, wall, wall],
                [wall, wall, wall],
                [wall, wall, wall]
            ]
        } as Maze
    );
});

const maze_1x1_free = new_maze(1);
const maze_1x1_walled = new_maze(1, wall);

const maze_3x3_free = new_maze(3);
const maze_3x3_walled = new_maze(3, wall);

test("Test flattening a 2d index from a maze", () => {
    expect(flatten_index(0, 0, maze_1x1_free)).toStrictEqual(0);
    expect(flatten_index(0, 0, maze_1x1_walled)).toStrictEqual(0);
    expect(flatten_index(0, 1, maze_1x1_free)).toStrictEqual(undefined);
    expect(flatten_index(1, 0, maze_1x1_walled)).toStrictEqual(undefined);


    expect(flatten_index(0, 0, maze_3x3_free)).toStrictEqual(0);
    expect(flatten_index(0, 0, maze_3x3_walled)).toStrictEqual(0);

    expect(flatten_index(0, 0, maze_3x3_walled)).toStrictEqual(0);
    expect(flatten_index(0, 1, maze_3x3_free)).toStrictEqual(1);
    expect(flatten_index(0, 2, maze_3x3_walled)).toStrictEqual(2);
    expect(flatten_index(0, 3, maze_3x3_free)).toStrictEqual(undefined);
    expect(flatten_index(1, 0, maze_3x3_walled)).toStrictEqual(3);
    expect(flatten_index(1, 1, maze_3x3_free)).toStrictEqual(4);
    expect(flatten_index(1, 2, maze_3x3_walled)).toStrictEqual(5);
    expect(flatten_index(1, 3, maze_3x3_free)).toStrictEqual(undefined);
    expect(flatten_index(2, 0, maze_3x3_walled)).toStrictEqual(6);
    expect(flatten_index(2, 1, maze_3x3_free)).toStrictEqual(7);
    expect(flatten_index(2, 2, maze_3x3_walled)).toStrictEqual(8);
    expect(flatten_index(2, 3, maze_3x3_free)).toStrictEqual(undefined);
    expect(flatten_index(3, 0, maze_3x3_walled)).toStrictEqual(undefined);
});

test("Test deepening a 1d index to a 2d index", () => {
    expect(deepen_index(0, maze_1x1_free)).toStrictEqual(
        { row: 0, col: 0 }
    );
    expect(deepen_index(0, maze_1x1_walled)).toStrictEqual(
        { row: 0, col: 0 }
    );
    expect(deepen_index(1, maze_1x1_free)).toStrictEqual(
        undefined
    );
    expect(deepen_index(1, maze_1x1_walled)).toStrictEqual(
        undefined
    );


    expect(deepen_index(0, maze_3x3_free)).toStrictEqual(
        { row: 0, col: 0 }
    );
    expect(deepen_index(0, maze_3x3_walled)).toStrictEqual(
        { row: 0, col: 0 }
    );
    expect(deepen_index(0, maze_3x3_walled)).toStrictEqual(
        { row: 0, col: 0 }
    );
    expect(deepen_index(1, maze_3x3_free)).toStrictEqual(
        { row: 0, col: 1 }
    );
    expect(deepen_index(2, maze_3x3_walled)).toStrictEqual(
        { row: 0, col: 2 }
    );
    expect(deepen_index(3, maze_3x3_walled)).toStrictEqual(
        { row: 1, col: 0 }
    );
    expect(deepen_index(4, maze_3x3_free)).toStrictEqual(
        { row: 1, col: 1 }
    );
    expect(deepen_index(5, maze_3x3_walled)).toStrictEqual(
        { row: 1, col: 2 }
    );
    expect(deepen_index(6, maze_3x3_walled)).toStrictEqual(
        { row: 2, col: 0 }
    );
    expect(deepen_index(7, maze_3x3_free)).toStrictEqual(
        { row: 2, col: 1 }
    );
    expect(deepen_index(8, maze_3x3_walled)).toStrictEqual(
        { row: 2, col: 2 }
    );
    expect(deepen_index(9, maze_3x3_free)).toStrictEqual(undefined);

    expect(deepen_index(-1, maze_3x3_walled)).toStrictEqual(undefined);
});


test("Test converting a maze in to listgraph", () => {
    expect(maze_to_listgraph(new_maze(1, free))).toStrictEqual(
        {
            adj: [
                list()
            ],
            size: 1
        } as ListGraph
    );

    expect(maze_to_listgraph(new_maze(1, wall))).toStrictEqual(
        {
            adj: [
                list()
            ],
            size: 1
        } as ListGraph
    );

    expect(maze_to_listgraph(new_maze(2, free))).toStrictEqual(
        {
            adj: [
                list(1, 2),
                list(0, 3),
                list(0, 3),
                list(2, 1)
            ],
            size: 4
        } as ListGraph
    );

    expect(maze_to_listgraph(new_maze(2, wall))).toStrictEqual(
        {
            adj: [
                list(),
                list(),
                list(),
                list()
            ],
            size: 4
        } as ListGraph
    );
});
