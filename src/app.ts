import * as pixi from "pixi.js";
import { Free, Maze, MazeBlock, Wall, deepen_index, maze_to_listgraph } from "./maze";
import { lg_breadth_first } from "./graphs";
import { head, is_null, tail } from "./list";
import { is_empty, head as head_of_queue, dequeue } from "./queue_immutable";

const app = new pixi.Application<HTMLCanvasElement>({ resizeTo: window });
document.body.appendChild(app.view);

const maze_wall: Wall = false;
const not_visited: Free = true;

const maze: Maze = {
    width: 7,
    height: 8,
    matrix: [
        [
            maze_wall,
            not_visited,
            maze_wall,
            maze_wall,
            maze_wall,
            maze_wall,
            maze_wall
        ],
        [
            maze_wall,
            not_visited,
            not_visited,
            not_visited,
            not_visited,
            maze_wall,
            not_visited
        ],
        [
            maze_wall,
            maze_wall,
            maze_wall,
            maze_wall,
            not_visited,
            not_visited,
            not_visited
        ],
        [
            maze_wall,
            not_visited,
            not_visited,
            not_visited,
            not_visited,
            maze_wall,
            maze_wall
        ],
        [
            maze_wall,
            not_visited,
            maze_wall,
            maze_wall,
            not_visited,
            maze_wall,
            maze_wall
        ],
        [
            maze_wall,
            maze_wall,
            not_visited,
            not_visited,
            not_visited,
            maze_wall,
            maze_wall
        ],
        [
            maze_wall,
            not_visited,
            not_visited,
            maze_wall,
            not_visited,
            not_visited,
            maze_wall
        ],
        [
            maze_wall,
            maze_wall,
            maze_wall,
            maze_wall,
            maze_wall,
            maze_wall,
            maze_wall
        ]
    ]
};

const cell_height = app.screen.height / maze.height;
const cell_width = app.screen.width / maze.width;

// sometinh ~2 days
// other [optional] ~3 days

function init_teture_array(
    maze: Array<Array<MazeBlock>>
): Array<Array<pixi.Sprite>> {
    const result = Array<Array<pixi.Sprite>>(maze.length);
    maze.forEach((maze_row, row) => {
        result[row] = Array<pixi.Sprite>(maze_row.length);
        maze_row.forEach((cell, col) => {
            result[row][col] = new pixi.Sprite(pixi.Texture.WHITE);
            switch (cell) {
            case maze_wall:
                result[row][col].tint = 0x000000;
                break;

            case not_visited:
                result[row][col].tint = 0xffffff;
                break;

            default:
                break;
            }

            result[row][col].width = cell_width;
            result[row][col].height = cell_height;

            result[row][col].position.set(col * cell_width, row * cell_height);
            app.stage.addChild(result[row][col]);
        });
    });
    return result;
}

// create a new Sprite from an image path
// const err = pixi.Sprite.from("/assets/img/ermmm.png");

// create sprite from url
// const bunny = pixi.Sprite.from("https://pixijs.com/assets/bunny.png");

let textures = init_teture_array(maze.matrix);

let mili_seconds = 0;
const graph = maze_to_listgraph(maze);
let breadth_stream = lg_breadth_first(graph, 1, 47);

let in_queue = head(breadth_stream).in_queue;
while (!is_empty(in_queue)) {
    let pos = deepen_index(head_of_queue(in_queue), maze);
    if (pos !== undefined) {
        // cyan
        textures[pos.row][pos.col].tint = 0x34ebb7;
    }
    in_queue = dequeue(in_queue);
}

function draw(): void {
    console.log("Drawing...");

    textures = init_teture_array(maze.matrix);

    const stream_tail = tail(breadth_stream);
    if (!is_null(stream_tail)) {
        breadth_stream = stream_tail();
    }

    in_queue = head(breadth_stream).in_queue;
    while (!is_empty(in_queue)) {
        let pos = deepen_index(head_of_queue(in_queue), maze);
        if (pos !== undefined) {
            // ljusare cyan / grön
            textures[pos.row][pos.col].tint = 0x34ebb7;
        }
        in_queue = dequeue(in_queue);
    }

    let visited = head(breadth_stream).visited_nodes;
    visited.forEach((node) => {
        let pos = deepen_index(node, maze);
        if (pos !== undefined) {
            // grå
            textures[pos.row][pos.col].tint = 0xb0acb0;
        }
    });

    let current_path = head(breadth_stream).path_so_far;
    while (!is_empty(current_path)) {
        let pos = deepen_index(head_of_queue(current_path), maze);
        if (pos !== undefined) {
            if (head(breadth_stream).is_done) {
                // grön
                textures[pos.row][pos.col].tint = 0x00ff2f;
            } else {
                // gul
                textures[pos.row][pos.col].tint = 0xe8c100;
            }
        }
        current_path = dequeue(current_path);
    }

    let current_node = deepen_index(
        head(breadth_stream).current_node,
        maze
    );
    if (current_node !== undefined) {
        // lila
        textures[current_node.row][current_node.col].tint = 0xd534eb;
    }
}

app.ticker.add(() => {
    mili_seconds += app.ticker.deltaMS;
    if (mili_seconds >= 1000) {
        mili_seconds = 0;
        draw();
    }

    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    // bunny.rotation += 0.1 * delta;
});
