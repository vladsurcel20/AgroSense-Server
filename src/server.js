const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const sequelize = require("./config/connection");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const locationRouter = require("./routes/locationRoutes");
const greenhouseRouter = require("./routes/greenhouseRoutes");

dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Database synchronized");
    } catch (error) {
        console.error("Database synchronization failed", error);
    }
};

sequelize.authenticate()
    .then(() => {
      console.log("Connected to MySQL database ✅");
    //   syncDB();
    })
    .catch((err) => console.error("Database connection failed ❌", err));


app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/locations", locationRouter);
app.use("/api/greenhouses", greenhouseRouter);

