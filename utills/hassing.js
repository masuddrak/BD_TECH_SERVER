const bcrypt = require("bcryptjs");
exports.dohash = (value, soltValue) => { 
    const result = bcrypt.hash(value, soltValue)
    return result
}
exports.compareHashPassword = (password, hashPassword) => {
    const result = bcrypt.compare(password, hashPassword)
    return result
}