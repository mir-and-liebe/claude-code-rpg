// Exercise 5: A file full of bugs to find and fix

// Bug 1: Runtime error - accessing property of undefined
function getUserDisplayName(user) {
  return user.name.first + " " + user.name.last;
}

// Bug 2: Logic error - palindrome check is wrong
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z]/g, "");
  const reversed = cleaned.split("").reverse().join("");
  return cleaned !== reversed; // Whoops
}

// Bug 3: Edge case issues
function safeDivide(a, b) {
  return a / b;
}

// Bug 4: Inefficient - O(n^2) when it could be O(n)
function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}

// Bug 5: Async bug - doesn't wait for results
async function fetchAllUsers(ids) {
  const users = [];
  ids.forEach(async (id) => {
    const user = await simulateFetch(id);
    users.push(user);
  });
  return users; // Returns empty array!
}

function simulateFetch(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: `User ${id}` }), 10);
  });
}

// --- Test everything ---
console.log("=== Bug Hunt ===\n");

// Test 1: Will crash
try {
  console.log("Display name:", getUserDisplayName({ name: { first: "John", last: "Doe" } }));
  console.log("Display name (null):", getUserDisplayName(null));
} catch (e) {
  console.log("Bug 1 crashed:", e.message);
}

// Test 2: Logic error
console.log("\nisPalindrome('racecar'):", isPalindrome("racecar"), "(should be true)");
console.log("isPalindrome('hello'):", isPalindrome("hello"), "(should be false)");

// Test 3: Edge cases
console.log("\nsafeDivide(10, 2):", safeDivide(10, 2));
console.log("safeDivide(10, 0):", safeDivide(10, 0), "(should handle gracefully)");
console.log("safeDivide('a', 2):", safeDivide("a", 2), "(should handle gracefully)");

// Test 4: Works but slow
console.log("\nduplicates:", findDuplicates([1, 2, 3, 2, 4, 3, 5]));

// Test 5: Async issue
fetchAllUsers([1, 2, 3]).then((users) => {
  console.log("\nfetched users:", users, "(should have 3 users)");
});

module.exports = { getUserDisplayName, isPalindrome, safeDivide, findDuplicates, fetchAllUsers };
