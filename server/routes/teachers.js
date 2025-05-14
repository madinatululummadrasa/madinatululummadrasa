const express = require('express');

module.exports = (db) => {
    const router = express.Router();
    const teachersCollection = db.collection('teachers');

    // Create Teacher
    router.post('/', async (req, res) => {
        try {
            const teachers = req.body;
            const result = await teachersCollection.insertOne(teachers);
            res.send(result);
        } catch (error) {
            console.error('Error saving student:', error);
            res.status(500).send({ message: 'Failed to save student' });
        }
    });

    // Get All Teacher
    router.get('/', async (req, res) => {
        try {
            const teachers = await teachersCollection.find().toArray();
            res.send(teachers);
        } catch (error) {
            console.error('Error fetching students:', error);
            res.status(500).send({ message: 'Failed to get students' });
        }
    });

    return router;
};
