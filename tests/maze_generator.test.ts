import { iterative_maze_generation } from "../src/maze_generator";
import { Maze, free, wall } from "../src/maze";


test("Is there a solvable 1x1 maze returned?", () => {
    expect(iterative_maze_generation(1, 0, false)).toStrictEqual(
        {
            width: 3,
            height: 3,
            matrix: [
                [wall, wall, wall],
                [wall, free, wall],
                [wall, wall, wall]
            ]
        } as Maze
    );
});

test("Is there a solvable 2x2 maze returned?", () => {
    expect(iterative_maze_generation(2, 0, false)).toStrictEqual(
        {
            width: 5,
            height: 5,
            matrix: [
                [wall, wall, wall, wall, wall],
                [wall, free, wall, free, wall],
                [wall, free, wall, free, wall],
                [wall, free, free, free, wall],
                [wall, wall, wall, wall, wall]
            ]
        } as Maze
    );
});

test("Is there a solvable 3x3 maze returned?", () => {
    expect(iterative_maze_generation(3, 0, false)).toStrictEqual(
        {
            width: 7,
            height: 7,
            matrix: [
                [wall, wall, wall, wall, wall, wall, wall],
                [wall, free, free, free, free, free, wall],
                [wall, wall, wall, free, wall, free, wall],
                [wall, free, wall, free, wall, free, wall],
                [wall, free, wall, wall, wall, free, wall],
                [wall, free, free, free, free, free, wall],
                [wall, wall, wall, wall, wall, wall, wall]
            ]
        } as Maze
    );
});
