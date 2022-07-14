const express = require('express');

const routes = require('./routes');

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(routes);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})