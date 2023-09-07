const { checkHashCompare } = require('../general/generalHelpers');

class Login{
    constructor(username,password){
        this.username = username;
        this.password = password;
    }
    //are there values?
    validateInputs = () => this.username && this.password;

    //give values for save (hash the password)
    getForCheck = () => {
        return {
            username: this.username,
            password: this.password
        }
    }

    //Check passwords
    checkPasswords = hashed => checkHashCompare(this.password,hashed); 
}





module.exports = {
    Login
}