class Signup {
    constructor(name, username, email, password) {
        this.name = name;
        this.username = username;
        this.email = email;
        this.password = password;
    }
    //are there values?
    validateInputs = () => this.name && this.username && this.password && this.email;

    //give values for save 
    getForSave = () => {
        return {
            name: this.name,
            username: this.username,
            email: this.email,
            password: this.password
        }
    }
}

class Update{
    constructor(values) {
        this.name = values.name;
        this.username = values.username;
        this.email = values.email;
        this.password = values.password;
        this.hidden = values.hidden;
        this.stopped = values.stopped;
        this.profile_image = values.profile_image;
        this.bio = values.bio;
        this.birth = values.birth;
    }

    validateInputs = () => Boolean(this.name || this.username || this.password || this.email || this.hidden || this.stopped || this.profile_image || this.bio || this.birth);


    getForUpdate = () => {
        let result = {};
        if(this.name) result.name = this.name;
        if(this.username) result.username = this.username;
        if(this.email) result.email = this.email;
        if(this.password)result.password = this.password;
        if(this.hidden)result.hidden = this.hidden;
        if(this.stopped)result.stopped = this.stopped;
        if(this.profile_image)result.profile_image = this.profile_image;
        if(this.bio)result.bio = this.bio;
        if(this.birth)result.birth = this.birth; 

        return result;
    }    
}

module.exports = {
    Signup,Update
}