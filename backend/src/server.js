import express from "express";
import { ENV } from "./config/env.js";

const app = express();

const PORT = ENV.PORT || 5001 ;

app.get("/api/health", (req, res) => {
    res.status(200).json({success: true, message:"Hello from the backend"});
});



app.listen(PORT, () => {
    console.log("Server started on port: " + PORT);
}); 
ENV