import express from 'express'
const app = express();
import configDotenv from 'dotenv';
configDotenv.config();

//Middlewares
app.use(express.json());

//Routes
import authRoute from './route/authRoute.js';
app.use('/auth',authRoute);

app.listen(process.env.PORT, (req, res) => {
  console.log("server is running on PORT: ", process.env.PORT);
})
