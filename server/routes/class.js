const express = require('express');


module.exports = (db) => {
  const router = express.Router();
  const academicCollection = db.collection('academic');

  // Create Academic Record
  router.post('/', async (req, res) => {
    try {
      const classes = req.body;
      const result = await academicCollection.insertOne(classes);
      res.send(result);
    } catch (error) {
      console.error('Error saving academic record:', error);
      res.status(500).send({ message: 'Failed to save academic record' });
    }
  });


  router.get('/', async (req, res) => {
    try {
      const classes = await academicCollection.find({}).toArray();
      res.send(classes);
    } catch (error) {
      console.error('Error fetching academic records:', error);
      res.status(500).send({ message: 'Failed to fetch academic records' });
    }
  }
  );










  return router;
}