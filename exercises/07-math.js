// Exercise 7: Functions to test

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero");
  return a / b;
}

function factorial(n) {
  if (n < 0) throw new Error("Negative numbers not supported");
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

function fibonacci(n) {
  if (n < 0) throw new Error("Negative index not supported");
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

module.exports = { add, subtract, multiply, divide, factorial, fibonacci, clamp };
