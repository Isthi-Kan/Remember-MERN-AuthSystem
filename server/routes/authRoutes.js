import express from "express";
import { deleteAccount, isAuthenticated, login, logout, register, resetPassword, sendResetPasswordOtp, sendVerifyOtp, verifyEmail, verifyResetPasswordOtp } from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router(); //authRouter = container for authentication routes

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.delete("/delete-account", userAuth,  deleteAccount);

authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp); //This route is protected by userAuth middleware. Only logged-in users can request to send a verification OTP.
authRouter.post("/verify-email", userAuth, verifyEmail); //This route is protected by userAuth middleware. Only logged-in users can verify their email using OTP.
authRouter.get("/is-auth", userAuth, isAuthenticated); //This route is protected by userAuth middleware. Only logged-in users can check if they are authenticated.
authRouter.post("/send-reset-otp", sendResetPasswordOtp);
authRouter.post("/verify-reset-otp", verifyResetPasswordOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;

/*
| ==========  Important  =================|

எல்லா routes-க்கும் userAuth middleware தேவையில்லை. Route-ன் purpose-ஐப் பொறுத்துதான் userAuth பயன்படுத்த வேண்டும்.

முதலில் userAuth என்ன செய்கிறது?

"இந்த request அனுப்பும் user ஏற்கனவே login செய்திருக்கிறாரா?" என்று check செய்கிறது.

    Request --> userAuth --> Login செய்திருக்கிறாரா? --> Yes → Controller-க்கு போகும் ✅, No  → Access denied ❌

1. Register → userAuth வேண்டாம் ❌
     -user account உருவாக்க login தேவையில்லை
      so userAuth தேவையில்லை.


2. Login → userAuth வேண்டாம் ❌
     -User login செய்ய வருகிறார்.

3. Send Verify OTP → userAuth வேண்டும் ✅
      -Login செய்த user-க்கு email verification OTP அனுப்புவது.

4. Verify Email → userAuth வேண்டும் ✅
       -ஒரு logged-in user தனது email-ஐ verify செய்கிறார்.

5. Is Auth → userAuth வேண்டும் ✅
      -"நான் authenticated user-ஆ?"

6. Send Reset OTP → userAuth வேண்டாம் ✅
      -User password மறந்துவிட்டார். அதனால் அவர் login செய்ய முடியாது.

7. /delete-account -> பொதுவாக userAuth பயன்படுத்துவது நல்லது:

*/ 