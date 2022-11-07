const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const data = require('./data/data.json');

app.get('/', (req, res) => {
    res.send("Server running")
})

app.get('/services', (req, res) => {
    res.send(data);
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})