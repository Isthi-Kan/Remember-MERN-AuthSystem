import mongoose from "mongoose"; //Import Mongoose It helps connect Node.js (backend) to MongoDB.

const connectDB = async () => {  //async → Allows us to use await.

    mongoose.connection.on("connected", () => //Check is MongoDB is connected or not.
        console.log("MongoDB connected successfully!")
    );

    await mongoose.connect(process.env.MONGODB_URI); //Connect to MongoDB using the URL from .env.
};

export default connectDB; //Export connectDB so another file can use it.