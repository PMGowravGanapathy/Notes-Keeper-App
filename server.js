const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Use absolute paths (important for Vercel)
const NOTES_FILE = path.join(__dirname, "notes.json");
const USERS_FILE = path.join(__dirname, "users.json");

//////////////////////
// Helper functions
//////////////////////

const readData = (file) => {
  try {
    if (!fs.existsSync(file)) return [];
    const data = fs.readFileSync(file, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Read Error:", err);
    return [];
  }
};

const writeData = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Write Error:", err);
  }
};

//////////////////////
// 🔐 USER LOGIN
//////////////////////

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readData(USERS_FILE);

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.json({ success: true, user });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

//////////////////////
// 📝 NOTES CRUD
//////////////////////

// Get all notes
app.get("/notes", (req, res) => {
  const notes = readData(NOTES_FILE);
  res.json(notes);
});

// Add note
app.post("/notes", (req, res) => {
  const notes = readData(NOTES_FILE);

  const newNote = {
    id: Date.now(),
    title: req.body.title,
    content: req.body.content,
  };

  notes.push(newNote);
  writeData(NOTES_FILE, notes);

  res.json(newNote);
});

// Update note
app.put("/notes/:id", (req, res) => {
  let notes = readData(NOTES_FILE);

  notes = notes.map((note) =>
    note.id == req.params.id
      ? { ...note, title: req.body.title, content: req.body.content }
      : note
  );

  writeData(NOTES_FILE, notes);
  res.json({ message: "Updated" });
});

// Delete note
app.delete("/notes/:id", (req, res) => {
  let notes = readData(NOTES_FILE);

  notes = notes.filter((note) => note.id != req.params.id);

  writeData(NOTES_FILE, notes);
  res.json({ message: "Deleted" });
});

//////////////////////
// ✅ EXPORT FOR VERCEL
//////////////////////

module.exports = app;