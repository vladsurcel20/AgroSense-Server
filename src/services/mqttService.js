const { SensorReading } = require('../models/associations');
const { mqttConfig, mqttClient } = require("../config/mqtt");

let saveInterval = 10 * 60 * 1000; // 10 minute
let lastSaveTime = null;
let latestData = null;

const handleSensorData = async (jsonString) => {
  try {
    const data = JSON.parse(jsonString);

    console.log("Parsed sensor data:", data);

    latestData = { ...data };

    const currentTime = new Date();
    if (currentTime - lastSaveTime >= saveInterval || lastSaveTime === null) {
      await saveLatestData();
    }

    const wss = require("./wssService");
    wss.emitSensorData(data.greenhouseId, data);

  } catch (error) {
    console.error("❌ Failed to process MQTT message:", error.message);
  }
};

const sendCommand = (command) => {
  const topic = `${mqttConfig.topics.commands}`;
  const message = JSON.stringify(command);
  const deviceId = command.greenhouseId;

  mqttClient.publish(topic, message, (err) => {
    if (err) {
      console.error("❌ Failed to publish command:", err.message);
    } else {
      console.log(`✅ Command sent to ${deviceId} →`, command);
    }
  });
};

const saveLatestData = async () => {
  try {
    if (!latestData || !latestData.readings) {
      return;
    }

    const recordedAt = new Date();

    const readingsArray = Object.entries(latestData.readings).map(
      ([sensorIdStr, value]) => ({
        sensorId: parseInt(sensorIdStr, 10),
        value: Number(value),
        recordedAt
      })
    );

    await SensorReading.bulkCreate(readingsArray);

    lastSaveTime = new Date();

    console.log("✅ Sensor data saved successfully.");

  } catch (error) {
    console.error("❌ Failed to save sensor data:", error.message);
  }
};

module.exports = {
  handleSensorData,
  sendCommand,
  saveLatestData
};
