import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; //Used to create a login/authentication token.
import userModel from "../model/userModel.js";
import transporter from "../config/nodemailer.js"; //Import the transporter object from nodemailer.js
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";



//Register a new user
export const register = async (req, res) => {  //creates the register controller.
    const { name, email, password } = req.body; //Get user data

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    try {  //We put risky operations inside try.

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new userModel({ name, email, password: hashedPassword }); //store new user details using userModel schema in MongoDB whith name "user"
        await newUser.save(); //saves the user into MongoDB.

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });  //creates a JWT token for the user, using UID and secrete key

        res.cookie('token', token, { //Put token in cookie (Browser, please store this JWT token as a cookie)
            httpOnly: true, //the cookie accessible only through HTTP requests
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send a welcome email to the user
        const mailOptions = {
            from: process.env.SMTP_USER_EMAIL, //Sender email address
            to: email, //registered user email address
            text: `Welcome to our platform, ${name}! We're excited to have you on board.`, //Email content
        };

        await transporter.sendMail(mailOptions); //Send the email using the transporter object from nodemailer.js

        return res.status(201).json({ success: true, message: "User registered successfully." })

    } catch (error) {
        console.error("Error in register:", error);
        res.status(500).json({ success: false, message: error.message || "Server error." });

    }

}

//Login a user
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    try {
        const existingUser = await userModel.findOne({ email });  //Now "existingUser" contains the user's informations from MongoDB database.
        if (!existingUser) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });  //After the user successfully logs in, the server needs a way to remember that the user

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ success: true, message: "User logged in successfully." });

    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ success: false, message: error.message || "Server error." });
    }
};


//Logout a user
export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        res.status(200).json({ success: true, message: "User logged out successfully." });

    } catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ success: false, message: error.message || "Server error." });
    }

};

//Delete account of a user
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.userId;

        await userModel.findByIdAndDelete(userId);

        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        res.status(200).json({ success: true, message: "User account deleted successfully." });
    } catch (error) {
        console.error("Error in deleteAccount:", error);
        res.status(500).json({ success: false, message: error.message || "Server error." });
    }
};


// Send Verification OTP to user's email
export const sendVerifyOtp = async (req, res) => { //This creates a function called sendVerifyOtp.
    try {
        const userId = req.userId; //userAuth.js middleware gets the user ID from the JWT and puts it into req.userId, Then sendVerifyOtp function takes that ID from userAuth. (oru user verify otp send pannuvadhatrku authenticate aahirukka vaendum. so avar userAuth middleware ai thaandi vara vaendum => authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp). appoadhu sendVerifyOtp function takes that ID.)
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.isAccountVerified) { //Check if already verified
            return res.status(400).json({ success: false, message: "Account is already verified." });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)); // It Generate a 6-digit OTP

        user.verifyOtp = otp;  //The generated OTP is stored in the user's database record.
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save(); //save otp and expiry time in database

        const mailOptions = {
            from: process.env.SMTP_USER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP for account verification is: ${otp}. It will expire in 24 hours.`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email),
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Verification OTP sent to email." });

    } catch (error) {
        console.error("Error in sending verification OTP:", error);
        res.status(500).json({ success: false, message: error.message || "Server error." });
    }
}

// Verify user's email using OTP
export const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body; //otp take from frintend
        const userId = req.userId; // userId take from userAuth middleware.

        if (!otp) {
            return res.status(400).json({ success: false, message: "Please provide OTP." });
        }
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (!user.verifyOtp || user.verifyOtp !== otp) { //There are two checks: 1. If the user has a stored OTP. 2. If the stored OTP matches the user entered OTP. 
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        if (Date.now() > user.verifyOtpExpireAt) {
            return res.status(400).json({ success: false, message: "OTP has expired." });
        }

        user.isAccountVerified = true; //Mark account as verified (Before verification:isAccountVerified = false)
        user.verifyOtp = ''; //Delete the OTP after verification
        user.verifyOtpExpireAt = 0; //Reset expiration time

        await user.save(); //Save changes to MongoDB

        res.status(200).json({ success: true, message: "Email verified successfully." });

    } catch (error) {
        console.error("Error in verifying OTP:", error);
        res.status(500).json({ success: false, message: error.message || "Server error." });
    }
}

// indha code User இன்னும் login/authenticated-ஆ இருக்கிறாரா என்று frontend-க்கு சொல்லுவது. ✅
export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "User is authenticated." });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server error." });
    }

}  //இந்த function-க்கு முன்னால் userAuth middleware இருக்கும்: authRouter.post("/is-auth", userAuth, isAuthenticated);  

// Frontend --> /is-auth request --> userAuth --> JWT token valid? --> YES ✅ --> isAuthenticated --> "User is authenticated."


// Send Reset Password OTP to user's email
export const sendResetPasswordOtp = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Please provide an email address." });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid user" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)); // It Generate a 6-digit OTP

        user.resetOtp = otp;  //The generated OTP is stored in the user's database record.
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save(); //save otp and expiry time in database

        const mailOptions = {
            from: process.env.SMTP_USER_EMAIL,
            to: email,
            subject: "Reset Password OTP",
            text: `Your OTP for resetting the password is: ${otp}. It will expire in 15 minutes.`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", email),
        };
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true, message: "Reset password OTP sent to email." });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server error." });
    }

}

// Verify Reset Password OTP
export const verifyResetPasswordOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Please provide email and OTP." });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid user" });
        }

        if (!user.resetOtp || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (Date.now() > user.resetOtpExpireAt) {
            return res.status(400).json({ success: false, message: "OTP has expired." });
        }

        return res.status(200).json({ success: true, message: "OTP verified successfully." });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server error." });
    }
}

// Reset user's password 
export const resetPassword = async (req, res) => {

    const { email, otp, newPassword } = req.body; //Get the data from frontend

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "Please provide email, OTP, and new password." });
    }

    try {

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid user" });
        }

        if (!user.resetOtp || user.resetOtp !== otp) { //Check whether user entered OTP is correct
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        if (Date.now() > user.resetOtpExpireAt) {
            return res.status(400).json({ success: false, message: "OTP has expired." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword; //The user's old password is replaced with the new hashed password.
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully." });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Server error." });
    }

}