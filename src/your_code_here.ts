// Example of some function we want to test
export function is_two(arg: number): boolean {
    if (arg === 2) {
        return true;
    } else {
        // Missed branch
        return false;
    }
}
