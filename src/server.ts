import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/connection";


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
  

  sequelize.authenticate()
  .then(() => console.log("Connected to MySQL database ✅"))
  .catch((err) => console.error("Database connection failed ❌", err));



