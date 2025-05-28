const { Sensor, GreenHouse } = require('../models/associations');

// GET /api/sensors or /api/sensors/:id
exports.getSensors = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { greenhouseId } = req.query; 
    const { id } = req.params;

    // Get a specific sensor by ID
    if (id) {
      const sensor = await Sensor.findOne({
        where: { id, userId },
      });
      if (!sensor) {
        return res.status(404).json({ message: 'Sensor not found or access denied' });
      }
      return res.status(200).json(sensor);
    }

    // Get all sensors for a greenhouse
    if (greenhouseId) {
      const greenhouse = await GreenHouse.findOne({
        where: { id: greenhouseId, userId, isActive: true }
      });
      if (!greenhouse) {
        return res.status(404).json({ message: 'Greenhouse not found or access denied' });
      }
      const sensors = await Sensor.findAll({
        where: { greenhouseId, userId }
      });
      return res.status(200).json(sensors);
    }

    // Get all sensors for the user
    const sensors = await Sensor.findAll({
      where: { userId }
    });
    return res.status(200).json(sensors);

  } catch (error) {
    console.error('Error fetching sensors:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.createSensor = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, type, greenhouseId, unit } = req.body; 

    if (!name || !type || !greenhouseId || !unit) { 
      return res.status(400).json({ message: 'The required fields are missing' });
    }

    const greenhouse = await GreenHouse.findOne({
      where: { id: greenhouseId, userId, isActive: true }
    });
    if (!greenhouse) {
      return res.status(404).json({ message: 'Greenhouse not found or access denied' });
    }

    const sensor = await Sensor.create({
      name,
      type,
      unit,
      greenhouseId,
      userId
    });

    return res.status(201).json(sensor);
  } catch (error) {
    console.error('Error creating sensor:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.updateSensor = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { name, type, greenhouseId, localization, unit } = req.body; 

    const sensor = await Sensor.findOne({ where: { id, userId } });
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found or access denied' });
    }

    if (greenhouseId) {
      const greenhouse = await GreenHouse.findOne({
        where: { id: greenhouseId, userId, isActive: true }
      });
      if (!greenhouse) {
        return res.status(404).json({ message: 'Greenhouse not found or access denied' });
      }
      sensor.greenhouseId = greenhouseId;
    }

    if (name) sensor.name = name;
    if (type) sensor.type = type;
    if (localization) sensor.localization = localization;
    if (unit) sensor.unit = unit;

    await sensor.save();
    return res.status(200).json(sensor);
  } catch (error) {
    console.error('Error updating sensor:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.deleteSensor = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const sensor = await Sensor.findOne({
      where: { id, userId }
    });
    if (!sensor) {
      return res.status(404).json({ message: 'Sensor not found or access denied' });
    }

    await sensor.destroy();
    return res.status(200).json({ message: 'Sensor deleted successfully' });
  } catch (error) {
    console.error('Error deleting sensor:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};