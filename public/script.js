const API = "http://localhost:3000/notes";

async function loadNotes() {
  const res = await fetch("/notes");
  const notes = await res.json();

  const container = document.getElementById("notesContainer");
  container.innerHTML = "";

  notes.forEach((note) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
    `;
    container.appendChild(div);
  });
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
  const title = document.querySelector("input").value;
  const content = document.querySelector("textarea").value;

  if (!title || !content) {
    alert("Please fill both fields");
    return;
  }

  await fetch("/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, content }),
  });

  // Clear inputs
  document.querySelector("input").value = "";
  document.querySelector("textarea").value = "";

  // Reload notes
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