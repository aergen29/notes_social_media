const signupInputsControl = (values)=>{
  let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  let nameRegex = /^[a-zA-Z\s]{3,28}$/;
  let isReady = true;
  let wrongInputs = [];
  if(values.name.length<3 || values.name.length>28 || !nameRegex.test(values.name)){
    isReady = false;
    wrongInputs.push('name');
  }
  if(values.username.length<3 || values.username.length>28){
    isReady = false;
    wrongInputs.push('username');
  }
  if(values.password.length<3 || values.password.length>28){
    isReady = false;
    wrongInputs.push('password');
  }
  if(values.email.length<3 || !emailRegex.test(values.email)){
    isReady = false;
    wrongInputs.push('email');
  }
  return {isReady,wrongInputs}
}

export default signupInputsControl;