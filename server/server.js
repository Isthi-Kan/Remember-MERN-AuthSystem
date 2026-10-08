import express from "express";  // impt Express. it helps create the backend server.
import cors from "cors";  // cors allows frontend and backend to communicate.
import 'dotenv/config';  // config loads the .env variables into the project.
import cookieParser from "cookie-parser"; // cookie-parser helps the backend read cookies from frontend requests.
import connectDB from "./config/mongodb.js"; //Import connectDB function from mongodb.js to connect to MongoDB.
import authRouter from "./routes/authRoutes.js"; 
import userRouter from "./routes/userRoutes.js";


const app = express(); //Create our Express(backend) server using imported express.
const PORT = process.env.PORT || 4000; //Choose the port number. 
//If .env has PORT, use it; Otherwise, use 4000.
connectDB(); 

const allowedOrigins = ['http://localhost:5173']  // It Tells Allow requests from this frontend "localhost:5173".

// Middlewares; a function that works between the request and the response.
app.use(express.json()); // Allow the backend to read JSON data.
app.use(cookieParser()); // Allow the backend to read cookies.
app.use(cors({ origin: allowedOrigins, credentials: true })); // Allow the backend to communicate with the frontend.
// credentials: true -> Allow cookies to be sent between frontend and backend.

//API Endpoints
app.get("/", (req, res) => {
    res.send("API is working fine!");
});  //This is the first/root API endpoint. When a GET request is sent to /, the backend responds with "API is working fine!". It can be used to check whether the backend API is running properly.

app.use("/api/auth", authRouter); // this middleware connects the authRouter to the backend server to execute. it tell use the authRouter for these urls "/api/auth"
app.use("/api/user", userRouter);

 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); //Start the server on the selected port.