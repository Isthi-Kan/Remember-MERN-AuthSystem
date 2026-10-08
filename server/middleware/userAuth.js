import jwt from 'jsonwebtoken'; //jsonwebtoken is a library used to: create JWT tokens, verify JWT tokens

const userAuth = (req, res, next) => {
    const { token } = req.cookies; //Get the token from cookies: When the user logs in successfully, your backend store a JWT token in a cookie.

    if (!token) { //Check if token exists
        return res.json({
            success: false,
            message: "Access denied. No token provided."
        });
    }

    try {
        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET); //It checks whether the JWT is valid. The JWT token created using your secret key. so the backend uses the same key to verify the token.

        if (!tokenDecoded.id) {  //your login code created the token using id also, thats why here use id. (see login code)
            return res.json({
                success: false,
                message: "Invalid token."
            });
        }

        req.userId = tokenDecoded.id; //இந்த code: JWT token-ல் இருக்கும் User ID-ஐ எடுத்து req.userId-ல் வைக்கிறது. ஏன் வைக்கிறார்கள்?... அடுத்த controller-க்கு எந்த user login செய்திருக்கிறார் என்று தெரிந்துகொள்ள.

        next(); //JWT is valid, so allow the user request to use routes and controller.

    } catch (error) {
        return res.json({
            success: false,
            message: error.message || "Invalid or expired token."
        });
    }
};

export default userAuth;