const bcrypt = require('bcryptjs');

const checkHashCompare = (notHashed,hashed) => bcrypt.compareSync(notHashed, hashed); 

module.exports = {
    checkHashCompare
}