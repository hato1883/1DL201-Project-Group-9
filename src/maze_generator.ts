import { Maze, MazeBlock } from "./maze";

// An algorithm that uses the recursive division method specified here
// https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method

function generate_maze(w: number, h: number, seed?: number): Maze {
    function seeded_random(input: number): [number, number] {
        return [1, 2];
    }

    if (seed === undefined) {
        return {
            width: w,
            height: h,
            matrix: [[true]]
        };
    } else {
        const seeded_value = seeded_random(seed);

        return {
            width: w,
            height: h,
            matrix: [[true]]
        };
    }
}

