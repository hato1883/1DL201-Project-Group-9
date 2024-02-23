import { Maze, MazeBlock, maze_to_listgraph, new_maze, wall, free } from "./maze";
import { type Stack, empty as empty_stack, stack, push, pop, top, is_empty } from "./stack";
import { splitmix32 } from "./psuedo_random";
import { filter, length, list_ref } from "./list";

// An algorithm that uses the recursive division method specified here
// https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
// Work in progress...




export function iterative_maze_generation(side: number, seed: number = 42): Maze {
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
    
    const result_maze: Maze = {
        width: (maze.width * 2) + 1,
        height: (maze.height * 2) + 1,
        matrix: Array<Array<MazeBlock>>((maze.width * 2) + 1)
    }

    // # # # # # # #
    // # O # O # O #
    // # # # # # # #
    // # O # O # O #
    // # # # # # # #
    // # O # O # O #
    // # # # # # # #
    result_maze.matrix.forEach(
        (maze_row, index) => {
            const new_row = Array<MazeBlock>((maze.width * 2) + 1);
            index % 2 === 1
                ? new_row.fill(wall)
                : new_row.forEach(
                    (square, index) => index % 2 === 1
                    ? square = wall
                    : square = free
                );
            maze_row = new_row;
        }
    );

    result_maze.matrix.forEach((maze_row) => maze_row = Array<MazeBlock>((maze.width * 2) + 1));

    //   O O O
    //   O O O
    //   O O O
    function remove_wall(st_node: number, nd_node: number): void {
        let target_col = (st_node * 2 + 1 - (st_node - nd_node))
        while(target_col >= result_maze.width) {
            target_col -= result_maze.width
        }
        let target_row = ((st_node % 3) * 2 + 1 - (st_node - nd_node))
        while (target_col >= result_maze.width) {
            target_col -= result_maze.width
        }
        result_maze.matrix[target_row][target_col] = free;
  }
    // J
    //I# # # # # # #
    // # O # O # O # [0][0] - start index
    // # # # # # # # [1][0] - tear down the wall
    // # O # O # O # [2][0] - target index
    // # # # # # # #
    // # O # O # O #
    // # # # # # # #

  // Exploration states
  const initialized = 0;
  const visited = 1;

  // initialized / visited / explored state of each node.
  const exploration_state = Array(unconnected_maze.size).fill(initialized);

  // Stack showing what node is next to check.
  let next_node: Stack<number> = empty_stack();

  function visit(node: number): void {
    exploration_state[node] = visited;
    push(node, next_node);
  }

  // 1 Choose the initial cell
  const starting_point = random_instance.random_int(0, side * side - 1);
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
          remove_wall(current_cell, random_negihbour);
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

  return maze;
}


export function lg_depth_first(graph: ListGraph, start: Node, end: Node): Path {
  // Exploration states
  const initialized = 0;
  const visited = 1;

  // const explored = 2;

  // create a data type to store:
  // initialized / visited / explored state of each node.
  const exploration_state = Array(graph.size).fill(initialized);

  // create a data type to store the path to the given node
  // (Path from `start` node)
  // All nodes start with a null path meaning there is no path
  const path_to_node = Array<Path>(graph.size).fill(null);

  // Queue showing what node is next to check.
  let next_node: Stack<Node> = empty_stack();

  // changes state of node to visisted,
  // adds parent node if one was given else sets it to null.
  // enqueues node to queue of nodes to check.
  function lg_depth_first_visit(
    node: Node,
    path_so_far: Queue<Node>
  ): Queue<Node> {
    exploration_state[node] = visited;
    next_node = push(node, next_node);
    return enqueue(node, path_so_far);
  }

  // enqueues the starting node with a empty path
  path_to_node[start] = lg_depth_first_visit(start, empty_stack());

  // Stepwise progression of dfs algorithm,
  // can easily be made into a stream call.
  function lg_depth_first_step(): boolean {
    if (!is_stack_empty(next_node)) {
      const node = stack_head(next_node);
      next_node = pop(next_node);
      if (node === end) {
        // TODO: return result
        return false;
      }
      for_each(
        (unvisted_node) => {
          path_to_node[unvisted_node] = lg_depth_first_visit(
            unvisted_node,
            path_to_node[node]
          );
        },
        filter((edge_endpoint) => {
          return exploration_state[edge_endpoint] === initialized;
        }, graph.adj[node])
      );
      return true;
    } else {
      return false;
    }
  }

  // runs lg_depth_first_step untill we have either visited all nodes
  // or we are at the goal.
  let running = lg_depth_first_step();
  while (running) {
    // run lg_depth_first_step untill we are at the end.
    running = lg_depth_first_step();
  }

  return path_to_node[end];
}




// pick a number in between 0 to width-1 and draw a line of blocked
// in that path across the entire maze

// 
