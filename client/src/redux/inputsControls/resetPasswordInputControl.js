const resetPasswordInputControl = (password)=>{
  let isReady = true;
  if(password.length<3 || password.length>28) isReady = false;
  
  return isReady
}

export default resetPasswordInputControl;