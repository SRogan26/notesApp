const apiUrl = 'http://localhost:8080/api/notes'
const noteListArea = document.getElementById('notes-list-display-area');
const newNoteInput = document.getElementById("new-note-input");
const addNoteBtn = document.getElementById("add-note-btn");
const notesList = document.getElementById("notes-list");
const rightDisplayArea = document.getElementById("right-display-area");

//renders a list item to represent a note record
const renderNotesFileData = (record, selectedNoteId) => {
    const newNoteElement = document.createElement('li');
    newNoteElement.setAttribute('id', record.id);
    const newCheckBox = document.createElement('input');
    newCheckBox.setAttribute('id', record.id);
    newCheckBox.setAttribute('type', 'checkbox');
    newCheckBox.checked = record.isDone;
    newCheckBox.addEventListener('click', async () => {
        await updateNoteStatus(newCheckBox);
    })
    const newNoteText = document.createElement('span');
    newNoteText.setAttribute('id', record.id);
    newNoteText.innerText = record.noteBody;
    if (record.id === selectedNoteId) {
        newNoteText.classList.add('selected-note');
        const deleteBtn = document.createElement('button');
        deleteBtn.addEventListener('click', async () => {
            await deleteSelectedNote();
            while (notesList.firstChild) notesList.removeChild(notesList.lastChild);
            await loadNotesFile(selectedNoteId);
            rightDisplayArea.style.display = "none";
        });
        deleteBtn.textContent = 'X';
        deleteBtn.classList.add('deleteBtn');
        newNoteText.appendChild(deleteBtn);
    }
    newNoteElement.prepend(newNoteText);
    newNoteElement.prepend(newCheckBox);
    notesList.append(newNoteElement);
}
//click listener for selecting an element
notesList.addEventListener('click', async (e) => {
    let selectedNoteId = '';
    const clickedElementTag = e.target.tagName.toLowerCase();
    const clickedElementParentTag = e.target.parentNode.tagName.toLowerCase();
    if (clickedElementTag === 'li' || clickedElementParentTag === 'li') {
        selectedNoteId = e.target.id
        while (notesList.firstChild) notesList.removeChild(notesList.lastChild);
        await loadNotesFile(selectedNoteId);
        rightDisplayArea.style.display = "block";
    }
})
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
const deleteSelectedNote = async () => {
    const elementToDelete = document.querySelector('.selected-note');
    const reqOptions = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "id": elementToDelete.id })
    }
    fetch(apiUrl, reqOptions)
        .then(res => res.json())
        .then(json => console.log(json));
}
//submit new note and re-render list on Add Note button click
addNoteBtn.addEventListener('click', async () => {
    if (!newNoteInput.value) return;
    const selectedElement = document.querySelector('.selected-note');
    while (notesList.firstChild) notesList.removeChild(notesList.lastChild);
    await submitNewNote();
    if (!selectedElement) await loadNotesFile();
    else await loadNotesFile(selectedElement.id);
    newNoteInput.value = null;
})
//load from notes file
const loadNotesFile = async (selectedNoteId) => {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(record => renderNotesFileData(record, selectedNoteId));
        })
        .catch(err => console.log(err))
}
//Populate notes list from file through API on page load
loadNotesFile();
