import { generate_maze } from "../src/maze_generator";
import { Maze,free } from "../src/maze";


test('Is there a maze returned?', () => {
    expect(generate_maze(1)).toStrictEqual(
    {
        width: 1,
        height: 1,
        matrix: [[free]]
    } as Maze
    )
});
