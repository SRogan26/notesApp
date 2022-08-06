const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const {
    getAllNotes,
    addNewNote,
    toggleNoteStatus
} = require('../../controllers/notes.js');
const notesFile = '../../notes.json'

router.get('/', (req, res) => {
    const data = getAllNotes();
    res.status(200).json(data);
});

router.post("/", (req, res) => {
    addNewNote(req.body.message);
    res.status(200).json('request received');
});

router.put("/", (req, res) => {
    toggleNoteStatus(req.body);
    res.status(200).json('record updated');
});

module.exports = router;