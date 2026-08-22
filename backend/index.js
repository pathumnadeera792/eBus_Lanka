import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import passengerRouter from "./routers/passengerRouter.js";
import operatorRouter from "./routers/operatorRouter.js";
import adminRouter from "./routers/adminRouter.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


const app = express();


//body parser middleware
app.use(bodyParser.json());


//middleware to verify JWT token
app.use(
  (req, res, next) => {
    const value = req.headers["authorization"]; //gain the token with bearer

    if (value != null) {
      const token = value.replace("Bearer ", ""); //remove the bearer from the token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          res.status(403).json({
            message: "You are not authorized to access this resource"
          })
        } else {
          req.passenger = decoded; //res the decoded token to the request object
          next();
        }
      })
    } else {
      next();
    }
  }
)


//connect to mongodb
const connectionString = process.env.MONGODB_URI;
mongoose.connect(connectionString).then(
    () => {
          console.log("Connected to MongoDB");
}).catch(() => {
    console.log("Error connecting to MongoDB");
})




app.use("/passengers", passengerRouter); // Route for passenger-related endpoints
app.use("/operators", operatorRouter); // Route for operator-related endpoints
app.use("/admins", adminRouter); // Route for admin-related endpoints


//listen to port 5000
app.listen(5000, () => {
  console.log("Server is running on port 5000");
})
