// Import express framework
import express from 'express'
const app = express();

// Load environment variables from .env file
import configDotenv from 'dotenv';
configDotenv.config();

//Middlewares
app.use(express.json());        // Parse incoming JSON requests

//Routes
import authRoute from './route/authRoute.js';
app.use('/auth',authRoute);

// Start the server and listen on the port
app.listen(process.env.PORT, (req, res) => {
  console.log("server is running on PORT: ", process.env.PORT);
})
