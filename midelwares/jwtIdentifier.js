const jwt = require("jsonwebtoken")
exports.verifiedJwt = async (req, res, next) => {
    let token;
    if (req.headers.client === "not-browser") {
        token=req.headers.authorization
    } else {
       token= req.cookies["Authorization"]
    }
    if (!token) {
        return res.status(401).json({success:false, message: "Access denied. No token provided." });
    }

    try {
        const userToken = token.split(" ")[1]
        const decoded = jwt.verify(userToken, process.env.jwtSecret);
        if (decoded) {
            req.user = decoded
            next();
        } else {
            throw new Error("error in the token request") 
        }
    } catch (error) {
        console.log(error)
    }

}