const path = require('path');
const fs = require('fs');
const notesFile = '../notes.json';
const notesPath = path.join(__dirname, notesFile)

//Note constructor
function Note(noteBody){
    this.id = Date.now().toString();
    this.noteBody = noteBody;
    this.isDone = false;
}

const getAllNotes = () => {
    const noteData = fs.readFileSync(notesPath, { encoding: 'utf-8' });
    const parsedNoteData = JSON.parse(noteData);
    return parsedNoteData;
}

const addNewNote = (note) => {
    console.log(note);
    const noteToAdd = new Note(note);
    const parsedNoteData = getAllNotes();
    //unshift adds to first position in array
    parsedNoteData.unshift(noteToAdd);
    //write function that takes the request body
    const stringifiedNotes = JSON.stringify(parsedNoteData);
    //and adds that note to the list of notes
    fs.writeFileSync(notesPath, stringifiedNotes);
}

const toggleNoteStatus = (note) => {
    const parsedNoteData = getAllNotes();
    parsedNoteData.forEach(record => {
        if(record.id === note.id) record.isDone = note.isDone;
    });
    const stringifiedNotes = JSON.stringify(parsedNoteData);
    fs.writeFileSync(notesPath, stringifiedNotes);
}
module.exports =
{
    getAllNotes,
    addNewNote,
    toggleNoteStatus
};