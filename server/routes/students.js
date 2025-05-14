const express = require('express');

module.exports = (db) => {
  const router = express.Router();
  const studentsCollection = db.collection('students');

  // Create Student
  router.post('/', async (req, res) => {
    try {
      const student = req.body;
      const result = await studentsCollection.insertOne(student);
      res.send(result);
    } catch (error) {
      console.error('Error saving student:', error);
      res.status(500).send({ message: 'Failed to save student' });
    }
  });

  // Get All Students
  router.get('/', async (req, res) => {
    try {
      const students = await studentsCollection.find().toArray();
      res.send(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).send({ message: 'Failed to get students' });
    }
  });

  return router;
};
