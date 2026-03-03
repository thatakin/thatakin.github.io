const numbers = [1, 2, 3, 4, 5];
const number = (n) => {
    return n * 10
}
const bigNumbers = numbers.map(number);
console.log(bigNumbers); // [10,20,30,40,50]