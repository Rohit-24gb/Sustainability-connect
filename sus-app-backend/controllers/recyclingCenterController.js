const RecyclingCenter = require('../models/RecyclingCenter');

// Controller to get all recycling centers
exports.getAllRecyclingCenters = async (req, res) => {
    try {
        const centers = await RecyclingCenter.find();
        res.json(centers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



// Controller to get a recycling center by centreID
exports.getRecyclingCenterByCentreID = async (req, res) => {
    try {
        const center = await RecyclingCenter.findOne({ centreID: req.params.centreID });
        if (center) {
            res.json(center);
        } else {
            res.status(404).json({ message: 'Center not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




// Controller to get a recycling center by ID
exports.getRecyclingCenterById = async (req, res) => {
    try {
        const center = await RecyclingCenter.findOne({ centreID: req.params.id });
        if (center) {
            res.json(center);
        } else {
            res.status(404).json({ message: 'Center not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller to create a new recycling center
exports.createRecyclingCenter = async (req, res) => {
    const newCenter = new RecyclingCenter(req.body);
    try {
        const savedCenter = await newCenter.save();
        res.status(201).json(savedCenter);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller to update a recycling center
exports.updateRecyclingCenter = async (req, res) => {
    try {
        const updatedCenter = await RecyclingCenter.findOneAndUpdate(
            { centreID: req.params.id },
            req.body,
            { new: true }
        );
        if (updatedCenter) {
            res.json(updatedCenter);
        } else {
            res.status(404).json({ message: 'Center not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Controller to delete a recycling center
exports.deleteRecyclingCenter = async (req, res) => {
    try {
        const deletedCenter = await RecyclingCenter.findOneAndDelete({ centreID: req.params.id });
        if (deletedCenter) {
            res.json({ message: 'Center deleted' });
        } else {
            res.status(404).json({ message: 'Center not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
