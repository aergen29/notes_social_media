const express = require('express');
const { newNote, editNote, getNote, getManyProfile, deleteNote, getManyMain } = require('../controler/note');
const { tokenVerify } = require('../middleware/token/tokenMiddleware');
const { decryptBody } = require('../middleware/crypt/cryptBody');
const route = express.Router();
const getManyRoute = express.Router();




route.post('/', tokenVerify, decryptBody, newNote);
route.post('/edit', tokenVerify, decryptBody, editNote);
route.get('/:link', getNote);
route.post('/delete/:link', tokenVerify, deleteNote);
route.use('/getmany', getManyRoute);

getManyRoute.post('/profile', decryptBody, getManyProfile);
getManyRoute.get('/main', tokenVerify, getManyMain );



module.exports = route;