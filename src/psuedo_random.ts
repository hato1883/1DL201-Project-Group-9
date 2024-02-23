/**
 * Takes in a seed
 * returns and returns a object containing diffrent function calls.
 * 
 */
function splitmix32(a: number): {
  random: () => number;
  random_int: (min?: number, max?: number) => number;
  random_float: (min?: number, max?: number) => number;
  random_bool: () => boolean;
} {
  function random() {
    a |= 0;
    a = (a + 0x9e3779b9) | 0;
    var t = a ^ (a >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  }
  function random_int(min: number = 0, max: number = 1): number {
    return Math.round(random() * (max - min) + min);
  }
  function random_float(min: number = 0, max: number = 1): number {
    return random() * (max - min) + min;
  }
  function random_bool(): boolean {
    return Math.round(random()) ? true : false;
  }
  return {
    random: random,
    random_int: random_int,
    random_float: random_float,
    random_bool: random_bool,
  };
}
const psuedo_random = splitmix32(10);
console.log(psuedo_random.random_bool());
console.log(psuedo_random.random_bool());
console.log(psuedo_random.random_bool());
console.log(psuedo_random.random_bool());
