const express = require('express'); ""
const { login,logout, refresh} = require('../controler/auth');
const router = express.Router();
const limiter = require('../middleware/security/limiter');
const { tokenVerify } = require('../middleware/token/tokenMiddleware');
const { decryptBody } = require('../middleware/crypt/cryptBody');

router.post('/login', limiter(),decryptBody, login);
router.post('/logout',tokenVerify,logout)
router.post('/refresh',decryptBody,refresh)



module.exports = router;