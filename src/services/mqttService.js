const { SensorReading, Sensor } = require('../models/associations');
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
    if (!latestData?.readings) return;

    const recordedAt = new Date();
    const sensorIds = Object.keys(latestData.readings).map(id => parseInt(id, 10));
    const sensors = await Sensor.findAll({ where: { id: sensorIds } });

    const readingsArray = await Promise.all(
      Object.entries(latestData.readings).map(async ([sensorIdStr, rawValue]) => {
        const sensorId = parseInt(sensorIdStr, 10);
        const sensor = sensors.find(s => s.id === sensorId);
        const distance = Number(rawValue);

        const baseResult = (value) => ({ sensorId, value, recordedAt });

        if (sensor?.type === 'water_level') {
          const { height_cm, radius_cm, width_cm, length_cm } = sensor;

          if ( height_cm  && distance >= 0 && distance <= height_cm) {
            const waterHeight = height_cm - distance;
            let volumeCm3 = 0;

            if (radius_cm) {
              volumeCm3 = Math.PI * Math.pow(radius_cm, 2) * waterHeight;
            } else if (width_cm && length_cm ) {
              volumeCm3 = width_cm * length_cm * waterHeight;
            } else {
              return baseResult(distance);
            }

            const volumeL = volumeCm3 / 1000;
            return baseResult(Math.round(volumeL * 100) / 100);
          }
          return baseResult(distance);
        }
        return baseResult(distance);
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
