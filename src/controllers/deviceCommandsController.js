const { DeviceCommand, ControlDevice } = require('../models/associations');
const { Op } = require('sequelize');

exports.getDeviceCommands = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { deviceId, startDate, endDate } = req.query;

    // Build filter
    const where = {};
    if (deviceId) where.deviceId = deviceId;

    // Filter by date range
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    // Only commands for user's devices
    const devices = await ControlDevice.findAll({ where: { userId } });
    const userDeviceIds = devices.map(d => d.id);
    if (!deviceId) {
      where.deviceId = { [Op.in]: userDeviceIds };
    } else if (!userDeviceIds.includes(Number(deviceId))) {
      return res.status(403).json({ message: 'Access denied to this device' });
    }

    const commands = await DeviceCommand.findAll({
      where,
    //   order: [['createdAt', 'DESC']]
    });

    return res.status(200).json(commands);
  } catch (error) {
    console.error('Error fetching device commands:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};