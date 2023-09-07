const { decrypt, encrypt } = require("../../helper/crypt/crypt");
const CustomError = require("../../helper/error/CustomError");


const decryptBody = (req, res, next) => {
  try {
    const { value } = req.body;
    const decrypted = decrypt(value);
    req.body = decrypted;
    next();
  } catch {
    throw new CustomError("Bad Request", 400)
  }
}

const encryptBody = (req, res, next) => {
  const value = req.result;
  if (!value) throw new CustomError("404 Not Founded", 404);
  const crypted = encrypt(value);
  res.json({ value: crypted });

}

module.exports = {
  decryptBody, encryptBody
}