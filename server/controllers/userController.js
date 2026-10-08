import userModel from "../model/userModel.js";


//Login செய்த user-ன் ID-ஐ வைத்து MongoDB-லிருந்து அவருடைய basic data-வை எடுத்துக்கொள்வது.
export const getUserData = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await userModel.findById(userId); //இந்த userId-க்கு சேர்ந்த user-ஐ கண்டுபிடி

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ //இங்கே database-லிருந்து 2 values மட்டும் frontend-க்கு அனுப்புகிறது:
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }

}

