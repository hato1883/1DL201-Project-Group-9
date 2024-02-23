import {
    Maze, MazeBlock,
    maze_to_listgraph,
    new_maze, wall, free
} from "./maze";
import {
    type Stack, empty as empty_stack,
    push, pop, top, is_empty
} from "./stack";
import { splitmix32 } from "./psuedo_random";
import { filter, length, list_ref } from "./list";

// An algorithm that uses the recursive division method specified here
// eslint-disable-next-line @stylistic/max-len
// https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
// Work in progress...


export function iterative_maze_generation(side: number, seed = 42): Maze {
    const random_instance = splitmix32(seed);

    // # # # # # # #
    // # O X O O O #
    // # X # O # # #
    // # O # O O O #
    // # O # O # O #
    // # O O O # O #
    // # # # # # # #
    //     /\
    //     ||
    //     \/
    //   O O O
    //   O O O
    //   O O O

    //   O O O
    //   O O O
    //   O O O
    let maze = new_maze(side, free);
    const unconnected_maze = maze_to_listgraph(maze);

    let matrix = Array<Array<MazeBlock>>((maze.width * 2) + 1);

    // # # # # # # #
    // # O # O # O #
    // # # # # # # #
    // # O # O # O #
    // # # # # # # #
    // # O # O # O #
    // # # # # # # #
    for (let r_index = 0; r_index < (maze.width * 2) + 1; r_index++) {
        matrix[r_index] = Array<MazeBlock>((maze.width * 2) + 1);
        for (let c_index = 0; c_index < (maze.width * 2) + 1; c_index++) {
            if (r_index % 2 === 0) {
                matrix[r_index][c_index] = wall;
            } else if (c_index % 2 === 0) {
                matrix[r_index][c_index] = wall;
            } else {
                matrix[r_index][c_index] = free;
            }
        }
    }

    const result_maze: Maze = {
        width: (maze.width * 2) + 1,
        height: (maze.height * 2) + 1,
        matrix: matrix
    };

    //   O O O
    //   O O O
    //   O O O
    function remove_wall(st_node: number, nd_node: number): void {
        let target_col = ((((st_node % side) * 2) + 1)
            - ((st_node % side) - (nd_node % side)));
        while (target_col >= result_maze.width) {
            target_col -= result_maze.width;
        }
        let target_row = (((Math.floor(st_node / side) * 2) + 1)
            - (Math.floor(st_node / side) - Math.floor(nd_node / side)));
        while (target_col >= result_maze.width) {
            target_col -= result_maze.width;
        }
        result_maze.matrix[target_row][target_col] = free;
    }

    //  0 1 2 3 4 5 6
    // 0# # # # # # #
    // 1# O # O # O # [0][0] - start index
    // 2# # # # # # # [1][0] - tear down the wall
    // 3# O # O # O # [2][0] - target index
    // 4# # # # # # #
    // 5# O # O # O #
    // 6# # # # # # #

    // Exploration states
    const initialized = 0;
    const visited = 1;

    // initialized / visited / explored state of each node.
    const exploration_state = Array(unconnected_maze.size).fill(initialized);

    // Stack showing what node is next to check.
    let next_node: Stack<number> = empty_stack();

    function visit(node: number): void {
        exploration_state[node] = visited;
        next_node = push(node, next_node);
    }

    // 1 Choose the initial cell
    const starting_point = random_instance.random_int(0, (side * side) - 1);
    visit(starting_point);

    // 2 while stack is not empty
    while (!is_empty(next_node)) {
        // 2.1 Pop a cell from the stack and make it a current cell
        const current_cell = top(next_node);
        next_node = pop(next_node);
        const unvisted_neighbours = filter(
            (edge_endpoint) => exploration_state[edge_endpoint] === initialized,
            unconnected_maze.adj[current_cell]
        );
        const num_unvisited = length(unvisted_neighbours);

        // 2.2 If the current cell has any unvisited neighbours
        if (num_unvisited > 0) {
        // 2.2.1 Push current cell to the stack
            visit(current_cell);

            // 2.2.2 Choose one of the unvisited neighbours
            const random_negihbour = list_ref(
                unvisted_neighbours,
                random_instance.random_int(0, num_unvisited)
            );

            if (random_negihbour !== undefined) {
                // 2.2.3 Remove the wall between
                // the current cell and the chosen cell
                remove_wall(current_cell, random_negihbour);

                // 2.2.4 Mark the chosen cell as visited
                // and push it to the stack
                visit(random_negihbour);

        // 2.2.3 Remove wall
        // # # # # # # #
        // # O # O # O #
        // # # # # # # #
        // # O # O # O #
        // # # # # # # #
        // # O # O # O #
        // # # # # # # #
        // [list(2),
        //  list(),
        //  list(0, 4),
        //  list(),
        //  list(2)]
        // [list(1),
        // O <-> O <-> O
        //  list(0, 2),
        //  list(1, 3),
        //  list(2, 4),
        //  list(3)]
            }
        }
    }

    return result_maze;
}
