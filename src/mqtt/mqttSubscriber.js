const { mqttClient } = require("../config/mqtt");
const { handleSensorData } = require("../services/mqttService");


mqttClient.on("connect", () => {
    console.log("Connected to MQTT broker");
    mqttClient.subscribe("sensors", (err) => {
        if (err) {
            console.error("MQTT subscription failed:", err);
        } else {
            console.log("Subscribed to topic: sensors");
        }
    });
});

mqttClient.on("message", (topic, messageBuffer) => {
    const message = messageBuffer.toString();

    if (topic === "sensors") {
        handleSensorData(message);
    } else {
        console.log(`Received message on topic '${topic}': ${message}`);
    }
});

mqttClient.on("error", (error) => {
    console.error("MQTT connection error:", error);
});

mqttClient.on("reconnect", () => {
    console.log("MQTT reconnecting...");
});