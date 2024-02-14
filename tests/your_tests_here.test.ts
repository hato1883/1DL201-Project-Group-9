// tests our sample function

import { is_two } from "../src/your_code_here";

// This test will miss line 7: "return false;"
test("Is 2, 2?", () => {
    expect(is_two(2)).toBeTruthy;
});
