const mqtt = require('mqtt');

const mqttConfig = {
  brokerUrl: process.env.MQTT_BROKER_URL,
  options: {
    // clientId: 'agrosense-server-' + Math.random().toString(16).substr(2, 8),
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD,
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
  },
  topics: {
    sensors: 'sensors',
    commands: 'commands'
  }
};

const mqttClient = mqtt.connect(mqttConfig.brokerUrl, mqttConfig.options);


module.exports = { mqttClient, mqttConfig };