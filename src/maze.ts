type free = true;
type wall = false;

type maze_block = wall | free;


type maze = {
    width: number,
    height: number,
    matrix: Array<Array<maze_block>>;

}