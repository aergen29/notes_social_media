const express = require('express');
const { tokenVerify } = require('../middleware/token/tokenMiddleware');
const route = express.Router();
const { like, unlike, save, unsave, newComment, updateComment,getCommentNote, getCommentProfile,follow, unfollow,deleteComment } = require('../controler/relationship');
const { decryptBody } = require('../middleware/crypt/cryptBody');
const commentRoute = express.Router()


route.post('/like', tokenVerify,decryptBody, like)
route.post('/unlike', tokenVerify,decryptBody, unlike)
route.post('/save', tokenVerify,decryptBody, save)
route.post('/unsave', tokenVerify,decryptBody, unsave)
route.use('/comment',commentRoute)
route.post('/follow',tokenVerify,decryptBody,follow)
route.post('/unfollow',tokenVerify,decryptBody,unfollow)



commentRoute.post('/', tokenVerify,decryptBody, newComment)
commentRoute.post('/update', tokenVerify,decryptBody, updateComment)
commentRoute.post('/delete', tokenVerify,decryptBody, deleteComment)
commentRoute.get('/note', tokenVerify,decryptBody, getCommentNote)
commentRoute.get('/profile', tokenVerify, getCommentProfile)




module.exports = route;