const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const dotenv = require("dotenv");
const sequelize = require("./config/connection");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const locationRouter = require("./routes/locationRoutes");
const greenhouseRouter = require("./routes/greenhouseRoutes");
const controlDeviceRouter = require("./routes/controlDeviceRoutes");
const sensorRouter = require("./routes/sensorRoutes");
const sensorReadingRouter = require("./routes/sensorReadingRoutes");
const deviceCommandRouter = require("./routes/deviceCommandRoutes");
const cultureRouter = require("./routes/cultureRoutes");
const wss = require("./services/wssService");
const GreenhousePreference = require("./models/GreenhousePreference");


dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}; (HTPP + WS)`);
});
wss.initialize(server);


const syncDB = async () => {
    try {
        await GreenhousePreference.sync({alter: true})
        await sequelize.sync();
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

require("./mqtt/mqttSubscriber");


app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/locations", locationRouter);
app.use("/api/greenhouses", greenhouseRouter);
app.use("/api/sensors", sensorRouter);
app.use("/api/devices", controlDeviceRouter);
app.use("/api/sensor_readings", sensorReadingRouter);
app.use("/api/device_commands", deviceCommandRouter);
app.use("/api/cultures", cultureRouter);
