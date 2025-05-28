const { Server } = require('socket.io');
const mqttService = require('./mqttService');
const SensorReadings = require('../models/SensorReadings');

let io = null;
const connectedGreenhouses = new Map();

const initialize = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  setupEventHandlers();
  console.log('WebSocket Service initializat');

  return io;
};

const setupEventHandlers = () => {
  io.on('connection', (socket) => {
    console.log(`🌐 Client conectat: ${socket.id}`);

    socket.on('authenticate', ({ greenhouseId }) => {
      // if (!verifyToken(token)) {
      //   return callback({ error: 'Neautorizat' });
      // }

      // socket.join(`greenhouse_${greenhouseId}`);
      //connectedGreenhouses.set(socket.id, greenhouseId);

      socket.join(room(greenhouseId));
      console.log(socket.rooms);
      // callback({ success: true });
    });

    socket.on('control_device', (command) => {
      // const greenhouseId = connectedGreenhouses.get(socket.id);
      const rooms = Array.from(socket.rooms);
      const greenhouseId = rooms.find(r => r.startsWith('greenhouse_'))?.split('_')[1];
      if (!greenhouseId) return;

      console.log(`🔄 Comandă pentru solar ${greenhouseId}:`, command);
      mqttService.sendCommand(command);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client deconectat: ${socket.id}`);
      connectedGreenhouses.delete(socket.id);
    });
  });
};

const emitSensorData = (greenhouseId, data) => {
  if (!io) return;

  io.to(room(greenhouseId)).emit('sensor_data', data);
};

const room = (id) => {
  return `greenhouse_${id}`;
}

const verifyToken = (token) => {
  return true;
};

module.exports = { initialize, emitSensorData };