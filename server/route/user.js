const express = require('express');
const { signup, profile, visit, forget, resetPassword, resetPasswordUpdate, deleteUser, updateUser, mostprofiles, search,updatePassword } = require('../controler/user');
const { tokenVerify } = require('../middleware/token/tokenMiddleware');
const router = express.Router();
const limiter = require('../middleware/security/limiter');
const { decryptBody } = require('../middleware/crypt/cryptBody');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + crypto.randomBytes(15).toString('hex') + '.' + file.mimetype.split('/')[1]);
  },
});
const upload = multer({ storage: storage });

router.post('/signup', limiter(), decryptBody, signup);
router.post('/profile', tokenVerify, profile);
router.post('/visit', decryptBody, visit);
router.post('/forget', limiter(3 * 60 * 1000, 10, 3), decryptBody, forget);
router.get('/resetpassword/:token', resetPassword);
router.put('/resetpassword', tokenVerify, decryptBody, resetPasswordUpdate);
router.post('/updatepassword', tokenVerify, decryptBody, updatePassword);
router.delete('/', tokenVerify, decryptBody, deleteUser);
router.post('/edit', tokenVerify, upload.single('profile_image'), updateUser);
router.get('/mostprofiles', mostprofiles);
router.post('/search', tokenVerify, decryptBody, search);



module.exports = router;