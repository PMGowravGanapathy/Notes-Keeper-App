const API = "http://localhost:3000/notes";

async function loadNotes() {
  const res = await fetch(API);
  const notes = await res.json();

  displayNotes(notes);
}

function displayNotes(notes) {
  const notesDiv = document.getElementById("notes");
  notesDiv.innerHTML = "";

  // 🔥 Show latest notes first (without mutating original array)
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

async function addNote() {
  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  // 🚫 Prevent empty notes
  if (!title || !content) {
    alert("Please enter both title and content!");
    return;
  }

  await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });

  // 🔥 Clear inputs after adding
  titleInput.value = "";
  contentInput.value = "";

  // 🎯 Focus back to title (nice UX touch)
  titleInput.focus();

  loadNotes();
}

async function deleteNote(id) {
  await fetch(`${API}/${id}`, { method: "DELETE" });
  loadNotes();
}

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
loadNotes();