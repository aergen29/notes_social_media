const express = require('express');
const route = express.Router();
const auth = require('./auth');
const user = require('./user');
const note = require('./note');
const relationship = require('./relationship');


route.use('/auth',auth);
route.use('/user',user);
route.use('/note',note);
route.use('/relationship',relationship)


module.exports = route;