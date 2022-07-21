const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const notesFile = '../../notes.json'

router.get('/', (req, res) => {
    const noteData = fs.readFileSync(path.join(__dirname,notesFile), {encoding: 'utf-8'});
    const parsedNoteData = JSON.parse(noteData);
    res.status(200).json(parsedNoteData);
});

router.post("/", (req,res)=>{
    console.log(req.body);
    //write function that takes the request body
    //and adds that note to the list of notes
    res.status(200).send('request received');
});

module.exports = router;