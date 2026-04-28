const API = "/notes"; 

// Load notes from backend
async function loadNotes() {
  try {
    const res = await fetch(API);
    const notes = await res.json();
    displayNotes(notes); 
  } catch (err) {
    console.error("Error loading notes:", err);
  }
}

// Display notes in UI
function displayNotes(notes) {
  const notesDiv = document.getElementById("notes"); 
  notesDiv.innerHTML = "";

  // Show latest first
  [...notes].reverse().forEach(note => {
    notesDiv.innerHTML += `
      <div class="note">
        <h3>${note.title}</h3>
        <p>${note.content}</p>
        <button onclick="deleteNote(${note.id})">Delete</button>
      </div>
    `;
  });
}

// Add note
async function addNote() {
  const title = document.getElementById("titleInput").value.trim();
  const content = document.getElementById("contentInput").value.trim();

  if (!title || !content) {
    alert("Please fill both fields");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });

  // Clear inputs
  document.getElementById("titleInput").value = "";
  document.getElementById("contentInput").value = "";

  loadNotes(); // ✅ refresh UI
}

// Delete note
async function deleteNote(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadNotes();
}

// Search notes
function searchNotes() {
  const keyword = document.getElementById("search").value.toLowerCase();
  const notes = document.querySelectorAll(".note");

  notes.forEach(note => {
    note.style.display = note.innerText.toLowerCase().includes(keyword)
      ? "block"
      : "none";
  });
}

// Initial load
window.onload = loadNotes;