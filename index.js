const express = require('express');
const app = express();
const cors = require('cors')
const mongoose = require('mongoose');
const sockets = require('./sockets/sockets');

mongoose.connect('mongodb://localhost/project', {useNewUrlParser: true})
    .then(() => console.log('connnected to database'))
    .catch((err) => console.log('error connecting to database', err));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const userRoute = require('./routes/user-route');
const chatRoute = require('./routes/chats-route');
const searchRoute = require('./routes/search-route');

app.use('/usersearch', searchRoute);
app.use('/user', userRoute);
app.use('/userchats', chatRoute);

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => console.log('Server listening on port:', PORT));
sockets.initialize(server);
