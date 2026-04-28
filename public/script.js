// 🔥 Automatically detect API base (works for both local + Render)
const API = window.location.origin + "/notes";

// 🚀 Load notes
async function loadNotes() {
  try {
    const res = await fetch(API);

    if (!res.ok) throw new Error("Failed to fetch notes");

    const notes = await res.json();
    displayNotes(notes);

  } catch (err) {
    console.error("Error loading notes:", err);
  }
}

// 🎨 Display notes
function displayNotes(notes) {
  const notesDiv = document.getElementById("notes");
  notesDiv.innerHTML = "";

  if (!notes || notes.length === 0) {
    notesDiv.innerHTML = "<p class='empty'>No notes yet...</p>";
    return;
  }

  const reversed = [...notes].reverse();

  reversed.forEach(note => {
    const div = document.createElement("div");
    div.className = "note";

    div.innerHTML = `
      <h3>${escapeHTML(note.title)}</h3>
      <p>${escapeHTML(note.content)}</p>
      <button onclick="deleteNote(${note.id})">Delete</button>
    `;

    notesDiv.appendChild(div);
  });
}

// ➕ Add note
async function addNote() {
  const titleEl = document.getElementById("titleInput");
  const contentEl = document.getElementById("contentInput");

  const title = titleEl.value.trim();
  const content = contentEl.value.trim();

  if (!title || !content) {
    alert("Please fill both fields");
    return;
  }

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) throw new Error("Failed to add note");

    // Clear inputs
    titleEl.value = "";
    contentEl.value = "";

    // 🔥 Force reload
    await loadNotes();

  } catch (err) {
    console.error("Add error:", err);
    alert("Error adding note");
  }
}

// ❌ Delete note
async function deleteNote(id) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete");

    await loadNotes();

  } catch (err) {
    console.error("Delete error:", err);
    alert("Error deleting note");
  }
}

// 🔍 Search notes
function searchNotes() {
  const keyword = document.getElementById("search").value.toLowerCase();
  const notes = document.querySelectorAll(".note");

  notes.forEach(note => {
    note.style.display = note.innerText.toLowerCase().includes(keyword)
      ? "block"
      : "none";
  });
}

// 🔐 Prevent HTML injection (small but important)
function escapeHTML(str) {
  return str.replace(/[&<>"']/g, tag => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[tag]));
}

// 🚀 Init
window.onload = loadNotes;