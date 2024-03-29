import express, {NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user";
import brandRouter from "./routes/brand";
import listingRouter from "./routes/listing";
dotenv.config();


const app = express();

//  <----------- Parsing the request data from url-encoded format to JSON ----------->
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.json());

//  <----------- Middlewares ----------->
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use("/api", userRouter);
app.use("/api/brands", brandRouter);
app.use("/api/listings", listingRouter);

//  <----------- Connecting to the database and starting the app to listen ----------->
const MONGODB_URI = process.env["MONGODB_URI"];
const PORT = Number(process.env["PORT"]);

if (MONGODB_URI != undefined) {
    mongoose
        .connect(MONGODB_URI)
        .then(() => {
            console.log("Connected to the database successfully!");

            app.listen(PORT, () => {
                console.log(`App listening at http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            console.log("Error has occured when trying to connect to the database!", error);
        })
}
