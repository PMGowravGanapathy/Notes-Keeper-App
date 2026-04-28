const API = "/notes";

// 🚀 Load notes from backend
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

// 🎨 Display notes in UI
function displayNotes(notes) {
  const notesDiv = document.getElementById("notes");
  notesDiv.innerHTML = "";

  if (!notes || notes.length === 0) {
    notesDiv.innerHTML = "<p style='color: #aaa;'>No notes yet...</p>";
    return;
  }

  // Show latest first
  [...notes].reverse().forEach(note => {
    const div = document.createElement("div");
    div.classList.add("note");

    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <button onclick="deleteNote(${note.id})">Delete</button>
    `;

    notesDiv.appendChild(div);
  });
}

// ➕ Add note
async function addNote() {
  const title = document.getElementById("titleInput").value.trim();
  const content = document.getElementById("contentInput").value.trim();

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
    document.getElementById("titleInput").value = "";
    document.getElementById("contentInput").value = "";

    await loadNotes(); // ✅ ensure UI updates after API completes

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

    await loadNotes(); // ✅ refresh UI

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

// 🚀 Initial load
window.onload = loadNotes;