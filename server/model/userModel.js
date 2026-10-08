import mongoose from "mongoose";  //Mongoose helps Node.js/Express work with MongoDB.

const userSchema = new mongoose.Schema({ //A Schema defines what information a user should have.
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    verifyOtp: {type: String, default: ''},  //stores the OTP sent to the user for account/email verification.
    verifyOtpExpireAt: {type: Number, default: 0}, //This stores when the verification OTP expires.
    isAccountVerified: {type: Boolean, default: false},
    resetOtp: {type: String, default: ''}, //stores reset pwd otp
    resetOtpExpireAt: {type: Number, default: 0}, //stores when the password reset OTP expires.
})

const userModel = mongoose.models.user || mongoose.model('User', userSchema);  // see explaination in book

export default userModel;