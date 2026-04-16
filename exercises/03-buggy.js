// Exercise 3: Code with bugs and room for improvement

const products = [
  { id: 1, name: "Laptop", price: 999.99, category: "electronics" },
  { id: 2, name: "Coffee Mug", price: 12.50, category: "kitchen" },
  { id: 3, name: "Headphones", price: 79.99, category: "electronics" },
  { id: 4, name: "Notebook", price: 4.99, category: "office" },
  { id: 5, name: "Desk Lamp", price: 34.99, category: "office" },
];

// BUG: This function doesn't apply the discount correctly
function calculateTotal(items, discountPercent = 0) {
  let total = 0;
  for (const item of items) {
    total += item.price;
  }
  // Bug: adds discount instead of subtracting it
  total = total + (total * discountPercent / 100);
  return total.toFixed(2);
}

// This function has repetitive code that could be cleaner
function formatReport(items) {
  let report = "";

  report += "=== Sales Report ===\n";
  report += "\n";

  report += "Electronics:\n";
  const electronics = items.filter(i => i.category === "electronics");
  for (const item of electronics) {
    report += `  - ${item.name}: $${item.price}\n`;
  }
  report += `  Subtotal: $${electronics.reduce((sum, i) => sum + i.price, 0).toFixed(2)}\n`;
  report += "\n";

  report += "Kitchen:\n";
  const kitchen = items.filter(i => i.category === "kitchen");
  for (const item of kitchen) {
    report += `  - ${item.name}: $${item.price}\n`;
  }
  report += `  Subtotal: $${kitchen.reduce((sum, i) => sum + i.price, 0).toFixed(2)}\n`;
  report += "\n";

  report += "Office:\n";
  const office = items.filter(i => i.category === "office");
  for (const item of office) {
    report += `  - ${item.name}: $${item.price}\n`;
  }
  report += `  Subtotal: $${office.reduce((sum, i) => sum + i.price, 0).toFixed(2)}\n`;
  report += "\n";

  report += `TOTAL: $${calculateTotal(items)}\n`;

  return report;
}

// Test it out
console.log("Total with 10% discount:", calculateTotal(products, 10));
console.log("Expected: ~$1019.21 (10% off $1132.46)");
console.log("");
console.log(formatReport(products));

module.exports = { products, calculateTotal, formatReport };
