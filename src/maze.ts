export type Free = true;

export type Wall = false;

export type MazeBlock = Wall | Free;


// TODO 
// fixed size tuple of generic length try to incorperate maze size into the type

export type Maze = {
    width: number;
    height: number;
    matrix: Array<Array<MazeBlock>>;

};
