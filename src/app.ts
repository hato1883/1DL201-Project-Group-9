import * as pixi from "pixi.js";
import {
    Maze, deepen_index,
    flatten_index, free, wall, maze_to_listgraph
} from "./maze";
import { head, is_null, tail } from "./list";
import { Result, Stream } from "./path";
import { iterative_maze_generation } from "./maze_generator";
import { lg_breadth_first } from "./breadth_first";
import { lg_depth_first } from "./deapth_first";
import { lg_dijkstra_path } from "./dijkstra";
import { lg_a_star_path } from "./a_star";
import { dequeue, is_empty, head as queue_head } from "./queue_array";

const app = new pixi.Application<HTMLCanvasElement>({ resizeTo: window });
document.body.appendChild(app.view);

const maze: Maze = iterative_maze_generation(50);

// sometinh ~2 days
// other [optional] ~3 days

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

// create a new Sprite from an image path
// const err = pixi.Sprite.from("/assets/img/ermmm.png");

// create sprite from url
// const bunny = pixi.Sprite.from("https://pixijs.com/assets/bunny.png");

const graph = maze_to_listgraph(maze);
let algorithms: Array<{
    textures: Array<Array<pixi.Sprite>>;
    algorithm: Stream<Result>;
}> = [];


// Create a container holding breadth first
let container = new pixi.Container();

let start = flatten_index(1, 1, maze);
let end = flatten_index(maze.width - 2, maze.height - 2, maze);

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
        start === undefined ? 0 : start,
        end === undefined ? 0 : end
    )
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
        start === undefined ? 0 : start,
        end === undefined ? 0 : end
    )
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
        start === undefined ? 0 : start,
        end === undefined ? 0 : end
    )
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
        graph,
        maze,
        start === undefined ? 0 : start,
        end === undefined ? 0 : end
    )
};

// add to array of algorithms
algorithms.push(a_star_algorithm);

// add element to main stage
app.stage.addChild(container);

let mili_seconds = 0;

function draw(
    algorithms: Array<{
        textures: Array<Array<pixi.Sprite>>;
        algorithm: Stream<Result>;
    }>
): void {
    algorithms.forEach((algorithm) => {
        // Draw all visited nodes
        let visited = head(algorithm.algorithm).visited_nodes;
        visited.forEach((node) => {
            let pos = deepen_index(node, maze);
            if (pos !== undefined) {
                // grå
                algorithm.textures[pos.row][pos.col].tint = 0xb0acb0;
            }
        });

        // Draw all nodes pending a visit from algorithm
        let in_queue = head(algorithm.algorithm).in_queue;
        in_queue.forEach((node) => {
            let pos = deepen_index(node, maze);
            if (pos !== undefined) {
                // ljusare cyan
                algorithm.textures[pos.row][pos.col].tint = 0x34ebb7;
            }
        });

        // Draw the path taken to reach the current node
        const path = head(algorithm.algorithm).path_so_far;
        while (!is_empty(path)) {
            let pos = deepen_index(queue_head(path), maze);
            if (pos !== undefined) {
                if (head(algorithm.algorithm).is_done) {
                    // grön
                    algorithm.textures[pos.row][pos.col].tint = 0x00ff2f;
                } else {
                    // gul
                    algorithm.textures[pos.row][pos.col].tint = 0xe8c100;
                }
            }
            dequeue(path);
        }

        // Draw the current node
        let current_node = deepen_index(
            head(algorithm.algorithm).current_node,
            maze
        );
        if (current_node !== undefined) {
            // lila
            algorithm.textures
                [current_node.row][current_node.col].tint = 0xd534eb;
        }

        // Take the next step of the algorithm
        const stream_tail = tail(algorithm.algorithm);
        if (!is_null(stream_tail)) {
            algorithm.algorithm = stream_tail();
        }
    });
}

app.ticker.add(() => {
    mili_seconds += app.ticker.deltaMS;
    if (mili_seconds >= 1) {
        mili_seconds = 0;
        draw(algorithms);
    }

    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    // bunny.rotation += 0.1 * delta;
});
