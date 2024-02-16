type Free = true;

type Wall = false;

type MazeBlock = Wall | Free;


// TODO 
// fixed size tuple of generic length try to incorperate maze size into the type

type Maze = {
    width: number;
    height: number;
    matrix: Array<Array<MazeBlock>>;

};
