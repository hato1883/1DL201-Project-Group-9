/**
 * This function uses code and concepts explained within
 * https://stackoverflow.com
 * /questions/17035441
 * /looking-for-decent-quality-prng-with-only-32-bits-of-state
 * and is unfortunately a bit out of our reach right now, but the gist of it 
 * is that this is a seeded random number generation algorithm that utilizes 
 * bitwise operations. Which gives us the quality that the function is 
 * deterministic, but also produces seemlingy random numbers.
 * It seeds the random state so that we can use it for testing out 
 * our maze generation algorithm.
 * @param a Number
 * @returns An object with 4 seeded pseudorandom functions to call.
 */
export function splitmix32(a: number): {
    random: () => number;
    random_int: (min?: number, max?: number) => number;
    random_float: (min?: number, max?: number) => number;
    random_bool: () => boolean;
} {
    function random(): number {
        // Bitwise OR assigment operation equivalent to a = a | 0
        a |= 0;
        // Bitwise OR assigment operation with 0x9e3779b9.
        // 0x9e3779b9 is the Golden Ratio 
        // constant used for better hash scattering
        // See https://softwareengineering.stackexchange.com/a/402543 
        a = (a + 0x9e3779b9) | 0;
        
        // performs a bitwise XOR operation ('^') 
        // between the variable 'a' and the 
        // result of a right shift('>>>') 
        // of 'a' by 16 bits and stores result in t
        var t = a ^ (a >>> 16);

        // Multiplies the number by 0x21f0aaad 
        // (equivalent to 569420461 in decimal) with 32 - bit multiplication.
        t = Math.imul(t, 0x21f0aaad);

        // Performs a bitwise XOR operation between 
        // t and t bitshifted by 15 bits and stores the value in t.
        t = t ^ (t >>> 15);

        // Multiplies the number 0x735a2d97 
        // (equivalent to 1935289751 in decimal) with 32 - bit multiplication.
        t = Math.imul(t, 0x735a2d97);

        // 1. 't >>> 15' : Right shifts the 
        // bits of 't' by 15 positions with zero - fill.
        // 2. 't = t ^ (t >>> 15)': 
        // XORs the original value of 't' with the result of the right shift.
        // 3. '(t >>> 0)' : This is a zero-fill right shift by 0 bits.
        // 4. '/ 4294967296' : This devides the result by 4294967296,
        // which is equivalent to 2 ^ 32. 
        // This is done to normalize the value to a 
        // floating point number between 0 and 1.
        return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
    }
    // Uses the pseudo random hash to return an 
    // interger between a minimum and maximum, defaults with [0, 1]
    function random_int(min = 0, max = 1): number {
        return Math.round((random() * (max - min)) + min);
    }
    // Uses the pseudo random hash to return a 
    // floating point number scaled to[min, max) max exclusive.
    // Defaults to a number between 0 and 1
    function random_float(min = 0, max = 1): number {
        return (random() * (max - min)) + min;
    }
    function random_bool(): boolean {
        // Uses the pseudo random hash to 
        // return a floating point that is then rounded to either 0, 1
        // which corresponds to true or false.
        return Math.round(random()) ? true : false;
    }
    return {
        random: random,
        random_int: random_int,
        random_float: random_float,
        random_bool: random_bool
    };
}
