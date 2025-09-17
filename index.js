const express = require('express');

/** Db */
const mongoose = require('./db');

/** Middlewares */
const performance = require('./middlewares/performance');

/** Controllers */
const usersV1 = require('./controllers/v1/users');

//+++++++++++++++++++++++++++++++++++++++++++++//
const app = express();


app.use(express.json());

app.use(performance);

const PORT = 3001;
/** Controllers */
app.use('/api/v1/users', usersV1);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




