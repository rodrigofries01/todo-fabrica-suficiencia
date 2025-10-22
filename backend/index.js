require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const tasksRoutes = require('./routes/tasks');
require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);

app.get('/', (req, res) => res.send('Todo API with JWT running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
