

type free = true;

type wall = false;

type maze_block = wall | free;


// TODO fixed size tuple of generic length try to incorperate maze size into the type

type maze = {
    width: number,
    height: number,
    matrix: Array<Array<maze_block>>;

}

// export function view_maze(inp:maze) {

//     while()

// }