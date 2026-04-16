// Exercise 1: Your first file to explore and modify

function greet(name) {
  const greeting = `Hello from Claude Code Academy!`;
  console.log(greeting);
  return greeting;
}

function countDown(from) {
  for (let i = from; i > 0; i--) {
    console.log(`${i}...`);
  }
  console.log("Go!");
}

// Main
greet("Student");
countDown(3);
