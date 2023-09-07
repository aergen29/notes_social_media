const forgetPasswordInputControl = (username)=>{
  let isReady = true;
  if(username.length<3 || username.length>28) isReady = false;
  
  return isReady
}

export default forgetPasswordInputControl;