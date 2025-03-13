
const bcrypt = require('bcryptjs');
exports.dohash = (value, soltValue) => { 
    const result = bcrypt.hash(value, soltValue)
    return result
}