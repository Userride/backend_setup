const express = require('express');
const router = express.Router();
const { Patient } = require('../models/User');

// Function to generate a serial number based on the slot
const generateSerialNumber = async (slot) => {
  try {
    const count = await Patient.countDocuments({ slot: slot });
    return count + 1; // Increment count to generate next serial number
  } catch (error) {
    throw new Error('Error generating serial number');
  }
};

// Function to generate a random appointment number
const generateAppointmentNumber = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit number
};

// Endpoint to create a new patient appointment
router.post('/patients', async (req, res) => {
  try {
    const { slot } = req.body; // Extract slot from request body
    const serialNumber = await generateSerialNumber(slot);
    const appointmentNumber = generateAppointmentNumber();
    const patientData = {
      ...req.body,
      serialNumber: serialNumber,
      appointmentNumber: appointmentNumber
    };

    const patient = await Patient.create(patientData);
    res.json(patient);
  } catch (error) {
    console.error('Error creating patient appointment:', error);
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to get the latest patient appointment
router.get('/patients/latest', async (req, res) => {
  try {
    const latestPatient = await Patient.findOne().sort({ createdAt: -1 });
    res.json(latestPatient);
  } catch (error) {
    console.error('Error fetching latest patient appointment:', error);
    res.status(500).json({ error: 'Error fetching latest patient appointment' });
  }
});

module.exports = router;
