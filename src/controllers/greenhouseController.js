const { GreenHouse, Location, Sensor, ControlDevice, Culture} = require('../models/associations')
const { Sequelize } = require('sequelize');

exports.getAllGreenhouses = async (req, res) => {
  try {
    const { locationId } = req.query;
    const includeCount = req.query.count === 'true';
    const userId = req.user?.id;
    
    const location = await Location.findOne({
      where: { 
        id: locationId,
        userId: userId,
        isActive: true 
      }
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found or access denied' });
    }
    
    const greenhouses = await GreenHouse.findAll({
      where: { 
        locationId: locationId,
        isActive: true 
      },
      attributes: {
        include: includeCount ? [
          [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("sensors.id"))), "sensorCount"],
          [Sequelize.fn("COUNT", Sequelize.fn("DISTINCT", Sequelize.col("controlDevices.id"))), "deviceCount"]
        ] : []
      },
      include: includeCount ? [
        {
          model: Sensor,
          as: "sensors", 
          attributes: [],
          required: false
        },
        {
          model: ControlDevice, 
          as: "controlDevices", 
          attributes: [],
          required: false
        },
        {
          model: Culture,
          as: "culture",
          attributes: ["name"],
        }
      ] : [],
      group: includeCount ? ["GreenHouse.id"] : undefined,
      // order: [['name', 'ASC']]
    });
    
    return res.status(200).json(greenhouses);
  } catch (error) {
    console.error('Error fetching greenhouses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getGreenhouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const greenhouse = await GreenHouse.findOne({
      where: { 
        id: id,
        isActive: true 
      },
      include: [
        {
          model: Location,
          as: "location",
          where: { 
            userId: userId,
            isActive: true 
          },
          attributes: [],
        },
        {
          model: Culture,
          as: "culture",
          attributes: ["name"],
        }
      ]
    });
    
    if (!greenhouse) {
      return res.status(404).json({ message: 'Greenhouse not found or access denied' });
    }
    
    return res.status(200).json(greenhouse);
  } catch (error) {
    console.error('Error fetching greenhouse:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Create a new greenhouse
exports.createGreenhouse = async (req, res) => {
  try {
    const { name, type, locationId, userId } = req.body;
    
    if (!name || !locationId) {
      return res.status(400).json({ message: 'Name and Location are required' });
    }
    
    // Verify that the location belongs to the user
    const location = await Location.findOne({
      where: { 
        id: locationId,
        userId: userId,
        isActive: true,
      }
    });
    
    if (!location) {
      return res.status(404).json({ message: 'Location not found or access denied' });
    }
    
    const newGreenhouse = await GreenHouse.create({
      name,
      type,
      locationId,
      userId,
    });
    
    return res.status(201).json(newGreenhouse);
  } catch (error) {
    console.error('Error creating greenhouse:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a greenhouse
exports.updateGreenhouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, status, isActive, userId } = req.body;
    const authUserId = req.user?.id;
    
    const greenhouse = await GreenHouse.findOne({
      where: { 
        id: id
      },
      include: [{
        model: Location,
        where: { 
          userId: authUserId,
          isActive: true 
        }
      }]
    });
    
    if (!greenhouse) {
      return res.status(404).json({ message: 'Greenhouse not found or access denied' });
    }
    
    // Update only the fields that are provided
    if (name) greenhouse.name = name;
    if (type) greenhouse.type = type;
    if (status) greenhouse.status = status;
    if (userId) greenhouse.userId = userId;
    if (isActive !== undefined) greenhouse.isActive = isActive;

    greenhouse.lastVisited = new Date(); 

    await greenhouse.save();
    
    return res.status(200).json(greenhouse);
  } catch (error) {
    console.error('Error updating greenhouse:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Update a greenhouse (using PATCH)
exports.partialUpdateGreenhouse = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; 
    const userId = req.user?.id; // Should come from auth, not body
    
    // Find and verify ownership
    const greenhouse = await GreenHouse.findOne({
      where: { 
        id: id 
      },
      include: [{
        model: Location,
        as: "location",
        where: { 
          userId: userId,
          isActive: true 
        }
      }]
    });
    
    if (!greenhouse) {
      return res.status(404).json({ message: 'Greenhouse not found or access denied' });
    }
    
    // List of allowed fields that can be updated
    const allowedUpdates = ['name', 'status', 'isActive', 'cultureId', 'lastVisited', 'locationId'];
    const requestedUpdates = Object.keys(updates);
    
    // Validate updates
    const isValidUpdate = requestedUpdates.every(update => 
      allowedUpdates.includes(update)
    );
    
    if (!isValidUpdate) {
      return res.status(400).json({ message: 'Invalid updates attempted' });
    }
    
    // Apply updates
    requestedUpdates.forEach(update => {
      greenhouse[update] = updates[update];
    });

    greenhouse.lastVisited = new Date();
    
    await greenhouse.save();
    
    return res.status(200).json(greenhouse);
  } catch (error) {
    console.error('Error updating greenhouse:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.deleteGreenhouse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    // First find the greenhouse and check if it belongs to a location owned by the user
    const greenhouse = await GreenHouse.findOne({
      where: { 
        id: id
      },
      include: [{
        model: Location,
        where: { 
          userId: userId,
          isActive: true 
        }
      }]
    });
    
    if (!greenhouse) {
      return res.status(404).json({ message: 'Greenhouse not found or access denied' });
    }
    
    greenhouse.isActive = false;
    await greenhouse.save();
    
    return res.status(200).json({ message: 'Greenhouse deleted successfully' });
  } catch (error) {
    console.error('Error deleting greenhouse:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};