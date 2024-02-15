type free = true;
type wall = false;

type maze_block = wall | free;

// TODO fixed size tuple of generic length
type maze = {
    width: number,
    height: number,
    matrix: Array<Array<maze_block>>;

}