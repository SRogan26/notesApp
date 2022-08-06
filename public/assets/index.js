const apiUrl = 'http://localhost:8080/api/notes'
const noteListArea = document.getElementById('notes-list-display-area');
const newNoteInput = document.getElementById("new-note-input");
const addNoteBtn = document.getElementById("add-note-btn");
const notesList = document.getElementById("notes-list");

//renders a list item to represent a note record
const renderNotesFileData = (record) => {
    const newNoteElement = document.createElement('li');
    newNoteElement.setAttribute('id', record.id);
    const newCheckBox = document.createElement('input');
    newCheckBox.setAttribute('id', record.id);
    newCheckBox.setAttribute('type', 'checkbox');
    newCheckBox.checked = record.isDone;
    newCheckBox.addEventListener('click', async ()=> {
        await updateNoteStatus(newCheckBox);
    })
    newNoteElement.appendChild(newCheckBox);
    const newNoteText = document.createElement('span');
    newNoteText.setAttribute('id', record.id);
    newNoteText.innerText = record.noteBody;
    newNoteElement.appendChild(newNoteText);
    notesList.appendChild(newNoteElement);
}
//Generates Post request for new note
const submitNewNote = async () => {
    const reqOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "message": newNoteInput.value })
    }
    fetch(apiUrl, reqOptions)
        .then(res => res.json())
        .then(json => console.log(json));
}
//Generate Put request to update whether a note has been done or not
const updateNoteStatus = async (noteClicked) => {
    const reqOptions = {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "id": noteClicked.id,
            "isDone": noteClicked.checked
        })
    }
    fetch(apiUrl, reqOptions)
        .then(res => res.json())
        .then(json => console.log(json));
}
//submit new note and re-render list on Add Note button click
addNoteBtn.addEventListener('click', async () => {
    if (!newNoteInput.value) return;
    while (notesList.firstChild) notesList.removeChild(notesList.lastChild);
    await submitNewNote();
    await loadNotesFile()
})
//load from notes file
const loadNotesFile = async () => {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(record => renderNotesFileData(record));
        })
        .catch(err => console.log(err))
}
//Populate notes list from file through API on page load
loadNotesFile();
