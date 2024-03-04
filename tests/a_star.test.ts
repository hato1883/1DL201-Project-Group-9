import { lg_a_star_path } from "../src/a_star";
import { head, tail, is_null } from "../src/list";
import { Maze, new_maze } from "../src/maze";
import { Stream, Result } from "../src/path";
import { queue } from "../src/queue_array";


function eval_stream(stream: Stream<Result>): Result {
    let return_value = stream;
    while (!head(return_value).is_done) {
        let stream_tail = tail(return_value);
        if (!is_null(stream_tail)) {
            return_value = stream_tail();
        } else {
            return head(return_value);
        }
    }
    return head(return_value);
}

test("test listgraph A* search", () => {
    let maze: Maze;
    maze = new_maze(2);
    let result: Result = eval_stream(
        lg_a_star_path(
            maze,
            0,
            3
        )
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(0, 1, 3)
    );


    maze = new_maze(3);
    result = eval_stream(
        lg_a_star_path(
            maze,
            0,
            8
        )
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(0, 1, 2, 5, 8)
    );


    maze = new_maze(3);
    maze.matrix[0][1] = false;
    result = eval_stream(
        lg_a_star_path(
            maze,
            0,
            8
        )
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(0, 3, 4, 5, 8)
    );


    maze = new_maze(3);
    maze.matrix[0][1] = false;
    maze.matrix[1][1] = false;
    result = eval_stream(
        lg_a_star_path(
            maze,
            0,
            8
        )
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(0, 3, 6, 7, 8)
    );


    maze = new_maze(3);
    maze.matrix[0][1] = false;
    maze.matrix[1][1] = false;
    result = eval_stream(
        lg_a_star_path(
            maze,
            0,
            2
        )
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue(0, 3, 6, 7, 8, 5, 2)
    );


    maze = new_maze(3);
    maze.matrix[0][1] = false;
    maze.matrix[1][1] = false;
    maze.matrix[2][1] = false;
    result = eval_stream(
        lg_a_star_path(
            maze,
            0,
            8
        )
    );

    expect(
        result.path_so_far
    ).toStrictEqual(
        queue()
    );
});
