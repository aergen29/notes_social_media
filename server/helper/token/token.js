const jwt = require('jsonwebtoken');
const { JWT_EXPIRE, JWT_SECRET_KEY, JWT_REFRESH_SECRET_KEY, JWT_REFRESH_EXPIRE } = process.env;

const generateToken = (user,type = 'access') => {
  if(type == 'access') return jwt.sign(user, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRE });
  else return jwt.sign(user, JWT_REFRESH_SECRET_KEY, { expiresIn: JWT_REFRESH_EXPIRE });
}

const tokenOpen = async req => new Promise((resolve,reject)=>{
    if (!isTokenIncluded(req)) return resolve(["You are not authorized to access this page", 403]);
    const token = getTokenFromHeader(req);

    jwt.verify(token, JWT_SECRET_KEY, function (err, decoded) {
        if(err) return resolve(["You are not authorized to access this page", 401]);

        req.user = {
            name: decoded.name,
            username: decoded.username
        };
        return resolve(true);
    })
})

const isTokenIncluded = req => req.headers.authorization && req.headers.authorization.startsWith("Bearer:");
const getTokenFromHeader = req => req.headers.authorization.split(" ")[1];


module.exports = {
    generateToken, tokenOpen
}
