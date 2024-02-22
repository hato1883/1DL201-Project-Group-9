import { Maze, MazeBlock, new_maze,wall } from "./maze";

// An algorithm that uses the recursive division method specified here
// https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
// Work in progress...
export function generate_maze(side: number, seed?: number): Maze {

    let internal_seed: number;
    // Declared internal seed to avoid having to put if statements 
    // veryfying that a value that is being set to a number is indeed still a number
    if (seed === undefined) {
        // The "Standard" unless set otherwise
        internal_seed = 42;
    } else {
        internal_seed = seed;
    }

    

    let maze = new_maze(side);


    function seeded_random(input: number) {

        return {
            h: input % side ,
            v: input % side 
    };
    }

    function draw_line_across(arr: Array<Array<MazeBlock>>) {

        const int_random = seeded_random(internal_seed);
        
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                if (int_random.h || int_random.v) {
                    arr[i][j] == wall;
                }
            }
        }
        return arr;
    }

    let resulting_array = draw_line_across(maze.matrix);
    maze.matrix = resulting_array;


    return maze;
}


// pick a number in between 0 to width-1 and draw a line of blocked 
// in that path across the entire maze

// 
