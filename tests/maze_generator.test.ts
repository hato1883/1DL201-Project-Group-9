import { generate_maze } from "../src/maze_generator";
import { Maze,free } from "../src/maze";


test('Is there a solvable 1x1 maze returned?', () => {
    expect(generate_maze(1)).toStrictEqual(
    {
        width: 1,
        height: 1,
        matrix: [[free]]
    } as Maze
    )
});

test('Is there a solvable 2x2 maze returned?', () => {
    expect(generate_maze(2)).toStrictEqual(
    {
        width: 2,
        height: 2,
            matrix: [[free, free],
                     [free, free]]
    } as Maze
    )
});

test('Is there a solvable 3x3 maze returned?', () => {
    expect(generate_maze(3)).toStrictEqual(
    {
        width: 3,
        height: 3,
            matrix: [[free, free, free],
                     [free, free, free]]
    } as Maze
    )
});
