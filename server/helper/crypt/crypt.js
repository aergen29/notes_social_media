const CryptoJs = require("crypto-js");
const {CRYPT_SECRET_KEY} = process.env;


const encrypt = (value)=>{
  const valueString = JSON.stringify(value);
  const crypted = CryptoJs.AES.encrypt(valueString, CRYPT_SECRET_KEY).toString();
  return crypted;
}

const decrypt = (value)=>{
  const bytes  = CryptoJs.AES.decrypt(value, CRYPT_SECRET_KEY);
  const originalText = bytes.toString(CryptoJs.enc.Utf8);
  const jsonValue = JSON.parse(originalText);
  return jsonValue;  
}

module.exports = {
  encrypt,decrypt
}