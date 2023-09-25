import crypto from 'crypto'


export const generatePassword = () => {
    let salt = crypto.randomBytes(32).toString('hex');
    let password = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    let finalData = {
        salt: salt,
        hash: password
    };

    return finalData;
}

export const slug = () => {
    return crypto.randomBytes(10).toString('utf8');
}

export const isValidPassword = (passwordRequest, passwordSave, salt) => {
    var hashVarify = crypto.pbkdf2Sync(
        passwordRequest,
        salt,
        10000,
        64,
        "sha512"
    ).toString('hex');

    if (hashVarify === passwordRequest) {
        return true;
    } else {
        return false;
    }
}