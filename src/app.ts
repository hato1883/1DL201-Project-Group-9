import * as pixi from "pixi.js";

const app = new pixi.Application<HTMLCanvasElement>({ resizeTo: window });
document.body.appendChild(app.view);

const maze_wall = 0;
const not_visited = 1;
const visited = 2;
const queued = 3;
const next_in_queue = 4;

enum State {
    maze_wall,
    not_visited,
    visited,
    queued,
    next_in_queue
}

const maze = [
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
];
const cell_height = app.screen.height / maze.length;
const cell_width = app.screen.width / maze[0].length;

// sometinh ~2 days
// other [optional] ~3 days

function init_teture_array(
    maze: Array<Array<State>>
): Array<Array<pixi.Sprite>> {
    const result = Array<Array<pixi.Sprite>>(maze.length);
    maze.forEach((maze_row, row) => {
        result[row] = Array<pixi.Sprite>(maze_row.length);
        maze_row.forEach((cell, col) => {
            result[row][col] = new pixi.Sprite(pixi.Texture.WHITE);
            switch (cell) {
            case maze_wall:
                result[row][col].tint = 0xa0a0a0;
                break;

            case not_visited:
                result[row][col].tint = 0xffffff;
                break;

            case visited:
                result[row][col].tint = 0xc4c4c4;
                break;

            case queued:
                result[row][col].tint = 0x3bf7f1;
                break;

            case next_in_queue:
                result[row][col].tint = 0xf7b63b;
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

const textures = init_teture_array(maze);
console.log(textures);

let seconds = 0;

// Listen for animate update
let row = 3;
let col = 3;
app.ticker.add(() => {
    seconds += app.ticker.deltaMS;
    if (seconds >= 500) {
        const old_tint = textures[row][col].tint;
        textures[row][col].tint = 0xf00f0;
        seconds = 0;
        console.log("Randoming");
        let new_row = 0;
        let new_col = 0;
        while (maze[new_row][new_col] === maze_wall) {
            new_col = col;
            new_row = row;
            if (Math.random() > 0.5) {
                new_row = Math.max(
                    Math.min(
                        row + (Math.round(Math.random()) === 0 ? -1 : 1),
                        maze.length - 1
                    ),
                    0
                );
            } else {
                new_col = Math.max(
                    Math.min(
                        col + (Math.round(Math.random()) === 0 ? -1 : 1),
                        maze[row].length - 1
                    ),
                    0
                );
            }
        }

        row = new_row;
        col = new_col;
        textures[row][col].tint = old_tint;
        console.log("row: %d,  col: ", row, col);
        if (maze[row][col] === not_visited) {
            maze[row][col] = visited;
            textures[row][col].tint = 0xff0000;
        }
    }

    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    // bunny.rotation += 0.1 * delta;
});
