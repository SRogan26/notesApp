const apiUrl = 'http://localhost:8080/api/notes'
const noteListArea = document.getElementById('notes-list-display-area');
const newNoteInput = document.getElementById("new-note-input");
const addNoteBtn = document.getElementById("add-note-btn");
const notesList = document.getElementById("notes-list");
const rightDisplayArea = document.getElementById("right-display-area");
const taskList = document.getElementById('task-list');
const addTaskBtn = document.getElementById("add-task-btn");
const newTaskInput = document.getElementById("new-task-input");
const taskInputArea = document.getElementById("task-input-area");

//<li> creater
const assembleListElement = (record) => {
    const newNoteElement = document.createElement('li');
    newNoteElement.setAttribute('id', record.id);
    return newNoteElement;
}

//checkbox creater
const assembleCheckboxElement = (record) => {
    const newCheckBox = document.createElement('input');
    newCheckBox.setAttribute('id', record.id);
    newCheckBox.setAttribute('type', 'checkbox');
    newCheckBox.checked = record.isDone;
    newCheckBox.addEventListener('click', async () => {
        await updateTaskStatus();
    })
    return newCheckBox;
}

//<span> creater
const assembleSpanElement = (record, selectedNoteId) => {
    const newNoteText = document.createElement('span');
    newNoteText.setAttribute('id', record.id);
    newNoteText.innerText = record.noteBody;
    if (record.id === selectedNoteId) {
        newNoteText.classList.add('selected-note');
        const deleteBtn = assembleDeleteBtn(selectedNoteId)
        newNoteText.appendChild(deleteBtn);
    }
    return newNoteText;
}
//task <span> creater
const assembleTaskText = (record, selectedTaskId) => {
    const newTaskText = document.createElement('span');
    newTaskText.setAttribute('id', record.id);
    newTaskText.innerText = record.noteBody;
    if (record.id === selectedTaskId) {
        newTaskText.classList.add('selected-task');
        const deleteBtn = deleteTaskBtn(selectedTaskId)
        taskInputArea.appendChild(deleteBtn);
    }
    return newTaskText;
}

//delete button for notes creater
const assembleDeleteBtn = (selectedNoteId) => {
    const deleteBtn = document.createElement('button');
    deleteBtn.addEventListener('click', async () => {
        await deleteSelectedNote();
        refreshListAreas();
        await loadNotesFile(selectedNoteId);
        rightDisplayArea.style.display = "none";
    });
    deleteBtn.textContent = 'X';
    deleteBtn.classList.add('deleteBtn');
    return deleteBtn;
}
//delete button for task creater
const deleteTaskBtn = (selectedTaskId) => {
    const selectedNote = document.querySelector('.selected-note');
    const deleteBtn = document.createElement('button');
    deleteBtn.addEventListener('click', async () => {
        const selectedId = selectedNote.id;
        await updateTaskStatus({ deleteId: selectedTaskId });
        refreshListAreas();
        await loadNotesFile(selectedId);
        taskInputArea.removeChild(taskInputArea.lastChild);
    });
    deleteBtn.textContent = 'Remove Task';
    deleteBtn.classList.add('deleteBtn');
    return deleteBtn;
}

//assembles the notes list area
const assembleNotesList = (record, selectedNoteId) => {
    const newNoteElement = assembleListElement(record);
    // const newCheckBox = assembleCheckboxElement(record);
    const newNoteText = assembleSpanElement(record, selectedNoteId);
    newNoteElement.prepend(newNoteText);
    // newNoteElement.prepend(newCheckBox);
    notesList.append(newNoteElement);
}

const assembleTaskList = (note, selectedTaskId) => {
    note.taskList.forEach(record => {
        const newTaskElement = assembleListElement(record);
        const newCheckBox = assembleCheckboxElement(record);
        const newNoteText = assembleTaskText(record, selectedTaskId);
        // newNoteElement.prepend(newNoteText);
        newTaskElement.append(newNoteText);
        newTaskElement.prepend(newCheckBox);
        taskList.append(newTaskElement);
    });
}
//Clear list areas
const refreshListAreas = () => {
    while (notesList.firstChild) notesList.removeChild(notesList.lastChild);
    while (taskList.firstChild) taskList.removeChild(taskList.lastChild);
    taskList.display = 'none';
}

//renders a list item to represent a note record
const renderNotesFileData = (record, selectedNoteId, selectedTaskId) => {
    assembleNotesList(record, selectedNoteId);
    if (record.id === selectedNoteId) assembleTaskList(record, selectedTaskId);
}
//click listener for selecting an element in the notes list
notesList.addEventListener('click', async (e) => {
    let selectedNoteId = '';
    const clickedElementTag = e.target.tagName.toLowerCase();
    const clickedElementParentTag = e.target.parentNode.tagName.toLowerCase();
    if (clickedElementTag === 'li' || clickedElementParentTag === 'li') {
        if (taskInputArea.childElementCount >= 3)taskInputArea.removeChild(taskInputArea.lastChild);
        selectedNoteId = e.target.id
        refreshListAreas();
        await loadNotesFile(selectedNoteId);
        rightDisplayArea.style.display = "block";
    }
})
//click listener for selecting an element in the task list
taskList.addEventListener('click', async (e) => {
    const selectedNote = document.querySelector('.selected-note');
    const selectedNoteId = selectedNote.id;
    let selectedTaskId = '';
    const clickedElementTag = e.target.tagName.toLowerCase();
    const clickedElementParentTag = e.target.parentNode.tagName.toLowerCase();
    if (clickedElementTag === 'li' || clickedElementParentTag === 'li') {
        if (taskInputArea.childElementCount >= 3)taskInputArea.removeChild(taskInputArea.lastChild);
        selectedTaskId = e.target.id
        refreshListAreas();
        await loadNotesFile(selectedNoteId, selectedTaskId);
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
        .then(json => console.log(json))
        .catch(err => console.log(err));
}
//Generate Put request to update whether a note has been done or not
const updateTaskStatus = async (options = { newTaskText: null, deleteId: null }) => {
    const selectedNote = document.querySelector('.selected-note');
    const taskListData = new Array();
    taskList.childNodes.forEach(task => {
        const taskData = {
            id: task.id,
            noteBody: task.childNodes[1].textContent,
            isDone: task.childNodes[0].checked
        }
        taskListData.push(taskData);
    });
    const reqOptions = {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "selectedId": selectedNote.id,
            "taskList": taskListData,
            "newTaskBody": options.newTaskText,
            "deleteId": options.deleteId
        })
    }
    fetch(apiUrl, reqOptions)
        .then(res => res.json())
        .then(json => console.log(json))
        .catch(err => console.log(err));
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
        .then(json => console.log(json))
        .catch(err => console.log(err));
}
//submit new note and re-render list on Add Note button click
addNoteBtn.addEventListener('click', async () => {
    if (!newNoteInput.value) return;
    const selectedElement = document.querySelector('.selected-note');
    refreshListAreas();
    await submitNewNote();
    if (!selectedElement) await loadNotesFile();
    else await loadNotesFile(selectedElement.id);
    newNoteInput.value = null;
})
//submit new task and re-render list on Add Task button click
addTaskBtn.addEventListener('click', async () => {
    if (!newTaskInput.value) return;
    const selectedElement = document.querySelector('.selected-note');
    const selectedId = selectedElement.id;
    await updateTaskStatus({ newTaskText: newTaskInput.value });
    refreshListAreas();
    await loadNotesFile(selectedId);
    newTaskInput.value = null;
})
//load from notes file
const loadNotesFile = async (selectedNoteId, selectedTaskId) => {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(record => renderNotesFileData(record, selectedNoteId, selectedTaskId));
        })
        .catch(err => console.log(err))
}
//Populate notes list from file through API on page load
loadNotesFile();