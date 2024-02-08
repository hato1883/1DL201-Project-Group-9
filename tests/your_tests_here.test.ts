// tests our sample function

import {isTwo} from "../src/your_code_here";

// This test will miss line 7: "return false;"
test("Is 2, 2?", () => {
    expect(isTwo(2)).toBeTruthy;
});
