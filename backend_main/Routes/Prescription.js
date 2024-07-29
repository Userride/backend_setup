const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');

// GET all prescriptions
router.get('/', async (req, res) => {
    try {
        const prescriptions = await Prescription.find();
        res.status(200).json(prescriptions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET the latest prescription
router.get('/latest', async (req, res) => {
    try {
        const latestPrescription = await Prescription.findOne().sort({ createdAt: -1 });
        if (latestPrescription) {
            res.json(latestPrescription);
        } else {
            res.status(404).json({ message: 'No prescriptions found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching the latest prescription' });
    }
});

// GET a specific prescription by ID
router.get('/:id', async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);
        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        res.status(200).json(prescription);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create a new prescription
router.post('/', async (req, res) => {
    const newPrescription = new Prescription(req.body);
    try {
        const savedPrescription = await newPrescription.save();
        res.status(201).json(savedPrescription);
    } catch (err) {
        console.error("Error saving prescription:", err);
        res.status(400).json({ error: err.message });
    }
});

// PUT update a prescription by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedPrescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedPrescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        res.status(200).json(updatedPrescription);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE a prescription by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedPrescription = await Prescription.findByIdAndDelete(req.params.id);
        if (!deletedPrescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }
        res.status(200).json({ message: 'Prescription deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST reset the counter to 1
router.post('/reset-counter', async (req, res) => {
    try {
        const newPrescription = new Prescription({
            counter: 1,
        });
        await newPrescription.save();
        res.status(201).json(newPrescription);
    } catch (error) {
        res.status(500).json({ error: 'Error resetting counter' });
    }
});

// POST save a new prescription and increment the counter
router.post('/save', async (req, res) => {
    try {
        const { prescriptionData } = req.body;

        // Find the most recent prescription to get the current counter value
        const latestPrescription = await Prescription.findOne().sort({ createdAt: -1 });
        const currentCounter = latestPrescription ? latestPrescription.counter : 0;

        // Create a new prescription with the incremented counter value
        const newPrescription = new Prescription({
            ...prescriptionData,
            counter: currentCounter + 1,
        });

        await newPrescription.save();
        res.status(201).json(newPrescription);
    } catch (error) {
        res.status(500).json({ error: 'Error saving prescription' });
    }
});

module.exports = router;
