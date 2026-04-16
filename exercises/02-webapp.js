// Exercise 2: A mini web application to explore and understand

const express = require("express");
const app = express();

// In-memory database
const db = {
  users: [
    { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
    { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
    { id: 3, name: "Charlie", email: "charlie@example.com", role: "user" },
  ],
  posts: [
    { id: 1, userId: 1, title: "Welcome!", body: "First post on the platform." },
    { id: 2, userId: 2, title: "Hello World", body: "Excited to be here." },
  ],
};

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes: Users
app.get("/users", (req, res) => {
  res.json(db.users);
});

app.get("/users/:id", (req, res) => {
  const user = db.users.find((u) => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const newUser = {
    id: db.users.length + 1,
    name,
    email,
    role: "user",
  };
  db.users.push(newUser);
  res.status(201).json(newUser);
});

// Routes: Posts
app.get("/posts", (req, res) => {
  const { userId } = req.query;
  if (userId) {
    const filtered = db.posts.filter((p) => p.userId === parseInt(userId));
    return res.json(filtered);
  }
  res.json(db.posts);
});

app.get("/posts/:id", (req, res) => {
  const post = db.posts.find((p) => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  // Enrich with author info
  const author = db.users.find((u) => u.id === post.userId);
  res.json({ ...post, author: author?.name || "Unknown" });
});

// Routes: Stats
app.get("/stats", (req, res) => {
  res.json({
    totalUsers: db.users.length,
    totalPosts: db.posts.length,
    postsPerUser: db.posts.length / db.users.length,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
