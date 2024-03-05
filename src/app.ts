import * as pixi from "pixi.js";
import {
    Maze, deepen_index,
    flatten_index, free, wall, maze_to_listgraph, new_maze
} from "./maze";
import { head, is_null, tail } from "./list";
import { Result, Stream } from "./path";
import { iterative_maze_generation } from "./maze_generator";
import { lg_breadth_first } from "./breadth_first";
import { lg_depth_first } from "./deapth_first";
import { lg_dijkstra_path } from "./dijkstra";
import { lg_a_star_path } from "./a_star";
import { queue_to_array } from "./queue_array";

const app = new pixi.Application<HTMLCanvasElement>({ resizeTo: window });
document.body.appendChild(app.view);

const used = iterative_maze_generation(1, 0, false);

// Good settings found:

/*
*/
// all even
const maze: Maze = iterative_maze_generation(5, 10, true);
const steps_per_secound = 2;
const start = undefined;
const end = undefined;

// Random large maze 34 s
/*
const maze: Maze = iterative_maze_generation(35, 0, true);
const steps_per_secound = 1000;
const start = undefined;
const end = undefined;
*/

// dfs bad path
/*
const maze: Maze = iterative_maze_generation(5, 0, true);
const steps_per_secound = 2;
const start = undefined;
const end = undefined;
*/

// A* avoiding bad path
/*
const maze: Maze = iterative_maze_generation(5, 23, true);
const steps_per_secound = 2;
const start = undefined;
const end = undefined;
*/

// A* avoiding bad path on 10 x 10
/*
const maze: Maze = iterative_maze_generation(10, 12, true);
const steps_per_secound = 6;
const start = undefined;
const end = undefined;
*/

// Blank Maze diffrent spawns
/*
const maze: Maze = new_maze(10, free);
const steps_per_secound = 6;
const start = flatten_index(5, 5, maze);
const end = flatten_index(8, 8, maze);
*/

/**
 * Setsup A array of textures representing the maze
 * It can be used to recolor squares of the maze by the draw() method
 * @param maze Maze object to create textures for
 * @param container the container to display the textures in
 * @param width the width of the displayed maze
 * @param height the height of the displayed maze
 * @returns A Array of textures representing the given Maze
 */
function init_texture_array(
    maze: Maze,
    container: pixi.Container,
    width: number,
    height: number
): Array<Array<pixi.Sprite>> {
    const cell_height = (width) / maze.height;
    const cell_width = (height) / maze.width;

    const result = Array<Array<pixi.Sprite>>(maze.height);
    maze.matrix.forEach((maze_row, row) => {
        result[row] = Array<pixi.Sprite>(maze.width);
        maze_row.forEach((cell, col) => {
            result[row][col] = new pixi.Sprite(pixi.Texture.WHITE);
            switch (cell) {
            case wall:
                result[row][col].tint = 0x000000;
                break;

            case free:
                result[row][col].tint = 0xffffff;
                break;

            default:
                break;
            }

            result[row][col].width = cell_width;
            result[row][col].height = cell_height;

            result[row][col].position.set(
                (col * cell_width),
                (row * cell_height)
            );

            container.addChild(result[row][col]);
        });
    });
    return result;
}

type AlgorithmInstance = {
    textures: Array<Array<pixi.Sprite>>;
    algorithm: Stream<Result>;
    start: number;
    end: number;
};

/**
 * Setsup A array of algorithms that you want to display
 * @param maze Maze object to create textures for
 * @param container the container to display the textures in
 * @param width the width of the displayed maze
 * @param height the height of the displayed maze
 * @returns A Array of textures representing the given Maze
 */
function init_algortihm_array(
    maze: Maze,
    start: number | undefined = flatten_index(1, 1, maze),
    end: number | undefined =
    flatten_index(maze.width - 2, maze.height - 2, maze)
): Array<AlgorithmInstance> {
    const graph = maze_to_listgraph(maze);
    let algorithms: Array<AlgorithmInstance> = [];


    // Create a container holding breadth first
    let container = new pixi.Container();

    start = start === undefined ? 0 : start;
    end = end === undefined ? 0 : end;

    // Create the record holding textures and the algorithm
    let breadth_algorithm = {
        textures: init_texture_array(
            maze,
            container,
            (app.renderer.height - 20) / 2,
            (app.renderer.height - 20) / 2
        ),
        algorithm: lg_breadth_first(
            graph,
            start,
            end
        ),
        start,
        end
    };

    // add to array of algorithms
    algorithms.push(breadth_algorithm);

    // add element to main stage
    app.stage.addChild(container);


    // Create a container holding depth first
    container = new pixi.Container();

    // Move container to right half
    container.x = (app.screen.width * 1) / 4;
    container.y = (app.screen.height * 1) / 2;

    // Create the record holding textures and the algorithm
    let depth_algorithm = {
        textures: init_texture_array(
            maze,
            container,
            (app.renderer.height - 20) / 2,
            (app.renderer.height - 20) / 2
        ),
        algorithm: lg_depth_first(
            graph,
            start,
            end
        ),
        start,
        end
    };

    // add to array of algorithms
    algorithms.push(depth_algorithm);

    // add element to main stage
    app.stage.addChild(container);


    // Create a container holding depth first
    container = new pixi.Container();

    // Move container to right half
    container.x = (app.screen.width * 2) / 4;

    // Create the record holding textures and the algorithm
    let dijkstra_algorithm = {
        textures: init_texture_array(
            maze,
            container,
            (app.renderer.height - 20) / 2,
            (app.renderer.height - 20) / 2
        ),
        algorithm: lg_dijkstra_path(
            graph,
            start,
            end
        ),
        start,
        end
    };

    // add to array of algorithms
    algorithms.push(dijkstra_algorithm);

    // add element to main stage
    app.stage.addChild(container);


    // Create a container holding depth first
    container = new pixi.Container();

    // Move container to right half
    container.x = (app.screen.width * 3) / 4;
    container.y = (app.screen.height * 1) / 2;

    // Create the record holding textures and the algorithm
    let a_star_algorithm = {
        textures: init_texture_array(
            maze,
            container,
            (app.renderer.height - 20) / 2,
            (app.renderer.height - 20) / 2
        ),
        algorithm: lg_a_star_path(
            maze,
            start,
            end
        ),
        start,
        end
    };

    // add to array of algorithms
    algorithms.push(a_star_algorithm);

    // add element to main stage
    app.stage.addChild(container);

    return algorithms;
}


const algorithms = init_algortihm_array(maze, start, end);
let mili_seconds = 0;

/**
 * Takes in a array of Algorithm Instances
 * that holds a algorithm we want to visualize.
 * Each call displays the next step of the algorithm.
 * @param algorithms The alagoritms to update and draw.
 */
function draw(
    algorithms: Array<AlgorithmInstance>
): void {
    algorithms.forEach((algorithm) => {
        // Draw all visited nodes gray 0xb0acb0
        let visited = head(algorithm.algorithm).visited_nodes;
        visited.forEach((node) => {
            let pos = deepen_index(node, maze);
            if (pos !== undefined) {
                algorithm.textures[pos.row][pos.col].tint = 0xb0acb0;
            }
        });

        // Draw all nodes pending a visit from algorithm light blue 0x34ebb7
        let in_queue = head(algorithm.algorithm).in_queue;
        in_queue.forEach((node) => {
            let pos = deepen_index(node, maze);
            if (pos !== undefined) {
                algorithm.textures[pos.row][pos.col].tint = 0x34ebb7;
            }
        });

        // Draw the path taken to reach the current node
        // with green 0x00ff2f if finished else yellow 0xe8c100
        const path = queue_to_array(head(algorithm.algorithm).path_so_far);
        path.forEach((node) => {
            let pos = deepen_index(node, maze);
            if (pos !== undefined) {
                if (head(algorithm.algorithm).is_done) {
                    algorithm.textures[pos.row][pos.col].tint = 0x00ff2f;
                } else {
                    algorithm.textures[pos.row][pos.col].tint = 0xe8c100;
                }
            }
        });

        // Mark Current node with purple 0xd534eb
        let current_node = deepen_index(
            head(algorithm.algorithm).current_node,
            maze
        );
        if (current_node !== undefined) {
            algorithm.textures
                [current_node.row][current_node.col].tint = 0xd534eb;
        }

        // Mark Start with blue 0x0000ff
        let start = deepen_index(algorithm.start, maze);
        if (start !== undefined) {
            algorithm.textures[start.row][start.col].tint = 0x0000ff;
        }

        // Mark End with red 0xff0000
        let end = deepen_index(algorithm.end, maze);
        if (end !== undefined) {
            algorithm.textures[end.row][end.col].tint = 0xff0000;
        }

        if (!head(algorithm.algorithm).is_done) {
            // Take the next step of the algorithm
            const stream_tail = tail(algorithm.algorithm);
            if (!is_null(stream_tail)) {
                algorithm.algorithm = stream_tail();
            }
        }
    });
}

app.ticker.add(() => {
    mili_seconds += app.ticker.deltaMS;
    if (mili_seconds >= 1000 / steps_per_secound) {
        mili_seconds = 0;
        draw(algorithms);
    }

    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    // bunny.rotation += 0.1 * delta;
});
