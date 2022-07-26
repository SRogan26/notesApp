const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const notesFile = '../../notes.json'

const readParsedNotesFile = () => {
    const noteData = fs.readFileSync(path.join(__dirname,notesFile), {encoding: 'utf-8'});
    const parsedNoteData = JSON.parse(noteData);
    return parsedNoteData;
}

router.get('/', (req, res) => {
    const parsedNoteData = readParsedNotesFile();
    res.status(200).json(parsedNoteData);
});

router.post("/", (req,res)=>{
    const parsedNoteData = readParsedNotesFile();
    parsedNoteData.push(req.body);
    //write function that takes the request body
    const stringifiedNotes = JSON.stringify(parsedNoteData);
    //and adds that note to the list of notes
    fs.writeFileSync(path.join(__dirname,notesFile), stringifiedNotes);
    res.status(200).send('request received');
});

module.exports = router;