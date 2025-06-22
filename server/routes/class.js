const express = require('express');


module.exports = (db) => {
  const router = express.Router();
  const academicCollection = db.collection('academic');


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

  // Create Academic Record
   return router;
}