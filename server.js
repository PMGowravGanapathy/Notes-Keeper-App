const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const NOTES_FILE = "notes.json";
const USERS_FILE = "users.json";

// Helper functions
const readData = (file) => {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
};

const writeData = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});