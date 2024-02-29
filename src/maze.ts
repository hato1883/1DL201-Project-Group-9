import { ListGraph, lg_from_edges, EdgeList } from "./graphs";
import { list, pair } from "./list";

export type Free = true;
export const free = true;

export type Wall = false;
export const wall = false;

export type MazeBlock = Wall | Free;


export type Maze = {
    width: number;
    height: number;
    matrix: Array<Array<MazeBlock>>;

};

/**
 * Convienience function: returns whether the block is free or not.
 * @param maze_block The block we need to look at
 * @returns True if path, else false
 */
export function is_path(maze_block: MazeBlock): maze_block is Free {
    return maze_block;
}

/**
 * Convienience function: returns whether the block a wall or not.
 * @param maze_block Takes a block to look at
 * @returns True if wall, else false
 */
export function is_wall(maze_block: MazeBlock): maze_block is Wall {
    return !maze_block;
}

/**
 * 
 * @param size the size of the array
 * @param default_block what the array should be filled with, defaults to free.
 * @returns a Maze record with a {width: size, height: size, matrix: matrix}.
 * The matrix will be a two-dimensional array of size by size (size x size)
 * @example
 * // Returns a record with a 3x3 matrix 
 * let nm = new_maze(3);
 * 
 * // Results in the record 
 * {
 *  width : 3,
 *  height: 3,
 *  matrix: [
 *              [free, free, free],
 *              [free, free, free],
 *              [free, free, free]
 *  ]
 * }
 */
export function new_maze(size: number, default_block: MazeBlock = free): Maze {
    const matrix = Array<Array<MazeBlock>>(size);
    matrix.fill(Array<MazeBlock>(size));
    matrix.forEach((row) => {
        row.fill(default_block);
    });
    return {
        width: size,
        height: size,
        matrix: matrix
    };
}

/**
 * Takes a 2d array index and converts it into a 1d index
 * Usefull when doing operations on the Listgraph representation of the maze
 * and need the index from the maze object that uses 2d index.
 * 
 * @example
 * // Flatten the index row: 1, col: 2 of a 3x3 matrix
 * const maze = {
 *     width: 3,
 *     height: 3,
 *     matrix: [
 *         [Free, Free, Free],
 *         [Free, Free, Wall],
 *         [Free, Free, Free]
 *     ]
 * }
 * flatten_index(1, 3, maze)
 * // Returns 5 which is the 6th posistion in this array
 * // [Free, Free, Free, Free, Free, Wall, Free, Free, Free]
 * 
 * @param {number} row Index of the row in the 2d {Maze}
 * @param {number} col Index of the colum in the 2d {Maze}
 * @param {Maze} maze Maze object to refer the size of the array from
 * @returns {number} Index of the same object in a 1d array representation
 */
export function flatten_index(
    row: number,
    col: number,
    maze: Maze
): number | undefined {
    return maze.matrix.length <= row || row < 0
        ? undefined
        : maze.matrix[row].length <= col || col < 0
            ? undefined
            : (row * maze.width) + col;
}

/**
 * Takes a index of a Array an converts it into a 2d index of a given maze
 * Usefull when doing opperations on the Listgraph representation of the maze
 * and need the 2d matrix index from the node that uses 1d index.
 * 
 * @example
 * // deepen the index: 5 of a Array into a index of a 3x3 matrix
 * const maze = {
 *     width: 3,
 *     height: 3,
 *     matrix: [
 *         [Free, Free, Free],
 *         [Free, Free, Wall],
 *         [Free, Free, Free]
 *     ]
 * }
 * flatten_index(5, maze)
 * // Returns { row: 1, col: 2 } which is the 6th posistion in this array
 * // [Free, Free, Free, Free, Free, Wall, Free, Free, Free]
 * 
 * @param {number} index Index of the object in a 1d array representation
 * @param {Maze} maze The maze to use to refer to the index 2d representation
 * @returns { row: number; col: number } A record holding row and colum needed
 * to reach the same object in a 2d representation
 */
export function deepen_index(
    index: number,
    maze: Maze
): { row: number; col: number } | undefined {
    const row = Math.floor(index / maze.width);
    const col = index % maze.width;
    return index < 0
        ? undefined
        : maze.matrix.length <= row || row < 0
            ? undefined
            : maze.matrix[row].length <= col || col < 0
                ? undefined
                : { row: row, col: col };
}

/**
 * Converts a maze into a listgraph with edges between
 * each non wall position of the maze
 * 
 * @param maze The maze to convert into a undirected listgraph
 * @returns A undirected listgraph with edges between
 * each non-wall node of the maze
 */
export function maze_to_listgraph(maze: Maze): ListGraph {
    function has_edge(row: number, col: number): boolean {
        return 0 <= row && row < maze.matrix.length
            ? 0 <= col && col < maze.matrix[row].length
                ? is_path(maze.matrix[row][col])
                    ? true
                    : false
                : false
            : false;
    }
    let edges: EdgeList = list();
    maze.matrix.forEach((maze_row, row_index) => {
        maze_row.forEach((maze_block, col_index) => {
            if (is_path(maze_block)) {
                const source = flatten_index(row_index, col_index, maze);
                for (let x_offset = -1; x_offset < 1; x_offset += 2) {
                    if (has_edge(row_index, col_index + x_offset)) {
                        const target = flatten_index(
                            row_index,
                            col_index + x_offset,
                            maze
                        );
                        if (target !== undefined && source !== undefined) {
                            edges = pair(
                                pair(source, target),
                                pair(pair(target, source), edges)
                            );
                        }
                    }
                }
                for (let y_offset = -1; y_offset < 1; y_offset += 2) {
                    if (has_edge(row_index + y_offset, col_index)) {
                        const target = flatten_index(
                            row_index + y_offset,
                            col_index,
                            maze
                        );
                        if (target !== undefined && source !== undefined) {
                            edges = pair(
                                pair(source, target),
                                pair(pair(target, source), edges)
                            );
                        }
                    }
                }
            }
        });
    });
    return lg_from_edges(maze.height * maze.width, edges);
}
