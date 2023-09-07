const loginInputsControl = (values)=>{
  let isReady = true;
  let wrongInputs = [];
  if(values.username.length<3 || values.username.length>28){
    isReady = false;
    wrongInputs.push('username');
  }
  if(values.password.length<3 || values.password.length>28){
    isReady = false;
    wrongInputs.push('password');
  }
  return {isReady,wrongInputs}
}

export default loginInputsControl;