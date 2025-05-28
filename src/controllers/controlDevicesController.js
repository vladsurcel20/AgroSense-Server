const { ControlDevice, GreenHouse } = require('../models/associations');


exports.getDevices = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { greenhouseId } = req.query;
    const { id } = req.params;

 
    if (id) {
      const device = await ControlDevice.findOne({
        where: { id, userId },
      });
      if (!device) {
        return res.status(404).json({ message: 'Device not found or access denied' });
      }
      return res.status(200).json(device);
    }

    // Get all devices for a greenhouse
    if (greenhouseId) {
      const greenhouse = await GreenHouse.findOne({
        where: { id: greenhouseId, userId, isActive: true }
      });
      if (!greenhouse) {
        return res.status(404).json({ message: 'Greenhouse not found or access denied' });
      }
      const devices = await ControlDevice.findAll({
        where: { greenhouseId, userId }
      });
      return res.status(200).json(devices);
    }

    // Get all devices for the user
    const devices = await ControlDevice.findAll({
      where: { userId }
    });
    return res.status(200).json(devices);

  } catch (error) {
    console.error('Error fetching devices:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.createDevice = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, type, greenhouseId, localization, state } = req.body;

    if (!name || !type || !greenhouseId) {
      return res.status(400).json({ message: 'The required fields are missing' });
    }

    // Check greenhouse ownership
    const greenhouse = await GreenHouse.findOne({
      where: { id: greenhouseId, userId, isActive: true }
    });
    if (!greenhouse) {
      return res.status(404).json({ message: 'Greenhouse not found or access denied' });
    }

    const device = await ControlDevice.create({
      name,
      type,
      greenhouseId,
      userId,
      localization,
      state
    });

    return res.status(201).json(device);
  } catch (error) {
    console.error('Error creating device:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.updateDevice = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { name, type, greenhouseId, localization, state } = req.body;

    const device = await ControlDevice.findOne({
      where: { id, userId }
    });
    if (!device) {
      return res.status(404).json({ message: 'Device not found or access denied' });
    }

    if (greenhouseId) {
      // Check greenhouse ownership
      const greenhouse = await GreenHouse.findOne({
        where: { id: greenhouseId, userId, isActive: true }
      });
      if (!greenhouse) {
        return res.status(404).json({ message: 'Greenhouse not found or access denied' });
      }
      device.greenhouseId = greenhouseId;
    }

    if (name) device.name = name;
    if (type) device.type = type;
    if (localization) device.localization = localization;
    if (state !== undefined) device.state = state;

    await device.save();
    return res.status(200).json(device);
  } catch (error) {
    console.error('Error updating device:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.deleteDevice = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const device = await ControlDevice.findOne({
      where: { id, userId }
    });
    if (!device) {
      return res.status(404).json({ message: 'Device not found or access denied' });
    }

    await device.destroy();
    return res.status(200).json({ message: 'Device deleted successfully' });
  } catch (error) {
    console.error('Error deleting device:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};