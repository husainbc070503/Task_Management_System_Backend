require('dotenv').config();
const express = require('express');
const connectToDB = require('./db');
const app = express();
const port = process.env.PORT

app.use(express.json());
connectToDB();

app.get('/', async (req, res) => res.send("Hello World!"));
app.use('/api/user', require('./routes/Auth'));
app.use('/api/task', require('./routes/Tasks'));
app.listen(port, () => console.log(`Server connected to port ${port}`));
