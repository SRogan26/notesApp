const path = require('path');
const fs = require('fs');
const notesFile = '../notes.json';
const notesPath = path.join(__dirname, notesFile)

const getAllNotes = () => {
    const noteData = fs.readFileSync(notesPath, { encoding: 'utf-8' });
    const parsedNoteData = JSON.parse(noteData);
    return parsedNoteData;
}

const addNewNote = (note) => {
    const parsedNoteData = getAllNotes();
    //unshift adds to first position in array
    parsedNoteData.unshift(note);
    //write function that takes the request body
    const stringifiedNotes = JSON.stringify(parsedNoteData);
    //and adds that note to the list of notes
    fs.writeFileSync(notesPath, stringifiedNotes);
}
module.exports =
{
    getAllNotes,
    addNewNote
};