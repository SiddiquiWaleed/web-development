const validateEmail = (email) => {        
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(email) === false) {
        return false;
    }
    else {
        return true;
    }
}

const validatePassword = (password) => {
    if(password.length >= 8) {
        return true;        
    }
    else {
        return false;
    }
}

const validateName = (name) => {
    if(name.length > 3) {
        return true;
    }
    else {
        return false;
    }
}

exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.validateName = validateName;