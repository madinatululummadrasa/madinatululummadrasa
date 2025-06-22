const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (db) => {
  const router = express.Router();
  const academicCollection = db.collection('academic');

  // 📌 Create Academic Record
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

  // 📌 Get All Academic Records
  router.get('/', async (req, res) => {
    try {
      const classes = await academicCollection.find({}).toArray();
      res.send(classes);
    } catch (error) {
      console.error('Error fetching academic records:', error);
      res.status(500).send({ message: 'Failed to fetch academic records' });
    }
  });

  // ✅ Update Academic Record (class) by ID
  router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { className, status } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: 'Invalid ID format' });
    }

    try {
      const updateResult = await academicCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            className,
            status,
            updatedAt: new Date(), // optional
          },
        }
      );

      if (updateResult.modifiedCount === 0) {
        return res.status(404).send({ message: 'Class not found or already up to date' });
      }

      res.send({ message: 'Class updated successfully' });
    } catch (error) {
      console.error('Error updating class:', error);
      res.status(500).send({ message: 'Failed to update class' });
    }
  });

  return router;
};
