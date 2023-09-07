import CryptoJs from 'crypto-js';
const {REACT_APP_CRYPT_SECRET_KEY} = process.env;

export const encrypt = (value)=>{
  const valueString = JSON.stringify(value);
  const crypted = CryptoJs.AES.encrypt(valueString, REACT_APP_CRYPT_SECRET_KEY).toString();
  return crypted;
}

export const decrypt = (value)=>{
  const bytes  = CryptoJs.AES.decrypt(value, REACT_APP_CRYPT_SECRET_KEY);
  const originalText = bytes.toString(CryptoJs.enc.Utf8);
  const jsonValue = JSON.parse(originalText);
  return jsonValue;  
}

export const md5Convert = value=>{
  return CryptoJs.MD5(value)
}