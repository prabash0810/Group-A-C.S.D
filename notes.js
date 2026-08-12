"use strict";
const NOTES_KEY = "daywise.notes.v1";
let notes = JSON.parse(localStorage.getItem(NOTES_KEY) || "[]");
const noteList = document.getElementById("noteList");
document.getElementById("noteForm").addEventListener("submit", function (event) { event.preventDefault(); notes.unshift({ id: Date.now(), title: noteTitle.value.trim(), body: noteBody.value.trim(), category: noteCategory.value, reminder: reminderDate.value, done: false }); saveNotes(); event.currentTarget.reset(); renderNotes(); });
function saveNotes() { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); }
function toggleNote(id) { const note = notes.find(item => item.id === id); note.done = !note.done; saveNotes(); renderNotes(); }
function deleteNote(id) { if (confirm("Delete this note?")) { notes = notes.filter(item => item.id !== id); saveNotes(); renderNotes(); } }
function renderNotes() { noteList.innerHTML = notes.length ? "" : '<p class="empty-state">No notes yet. Save an idea or reminder.</p>'; notes.forEach(note => { const item = document.createElement("article"); item.className = `organizer-item${note.done ? " complete" : ""}`; const reminder = note.reminder ? new Date(note.reminder).toLocaleString() : "No reminder"; item.innerHTML = `<div class="item-top"><div><h4>${escapeText(note.title)}</h4><div class="meta"><span class="tag">${escapeText(note.category)}</span><span class="tag">${escapeText(reminder)}</span></div></div><div class="item-actions"><button class="complete-action" type="button">${note.done ? "Undo" : "Done"}</button><button class="delete-action" type="button">Delete</button></div></div><p>${escapeText(note.body)}</p>`; item.querySelector(".complete-action").onclick = () => toggleNote(note.id); item.querySelector(".delete-action").onclick = () => deleteNote(note.id); noteList.appendChild(item); }); }
function escapeText(value) { const node = document.createElement("div"); node.textContent = value; return node.innerHTML; }
renderNotes();
