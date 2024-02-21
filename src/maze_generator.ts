import { Maze, new_maze } from "./maze";

// An algorithm that uses the recursive division method specified here
// https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
// Work in progress...
export function generate_maze(side: number, seed?: number): Maze {

    let maze = new_maze(side);


    // function seeded_random(input: number): [number, number] {
    //     return [1, 2];
    // }
    if (seed === undefined) {
        return maze;
        

    } else {
        // const seeded_value = seeded_random(seed);

        return maze;
    }
}


// pick a number in between 0 to width-1 and draw a line of blocked 
// in that path across the entire maze

// 
