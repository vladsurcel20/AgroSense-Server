const { GreenHouse, Location } = require('../models/associations')

// Get all greenhouses for a location
exports.getAllGreenhouses = async (req, res) => {
  try {
    const { locationId } = req.query;
    const userId = req.user?.id;
    
    // First verify that the location belongs to the user
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
      order: [['name', 'ASC']]
    });
    
    return res.status(200).json(greenhouses);
  } catch (error) {
    console.error('Error fetching greenhouses:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a specific greenhouse by ID
exports.getGreenhouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    const greenhouse = await GreenHouse.findOne({
      where: { 
        id: id,
        isActive: true 
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
    // const userId = req.user?.id;
    
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
    const allowedUpdates = ['name', 'type', 'status', 'isActive'];
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

// "Delete" a greenhouse (soft delete by setting isActive to false)
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