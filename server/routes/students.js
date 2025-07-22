const express = require('express');
const collection = require('./collection');



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


  // router.patch('/student/:id', async (req, res) => {
  //   const studentId = req.params.id; // e.g. "M24"
 
  //   const collectionData = req.body;
  //   if (collectionData.name === "ভর্তি ফি") {
  //     console.log("vorty fee triggered ")
  //   }



  //   const predue = collectionData.preDue || 0; // Default to 0 if not provided
  //   console.log('Updating collection for student:', studentId, 'with data:', collectionData);

  //   try {
  //     // ✅ No ObjectId validation needed

  //     const result = await studentsCollection.updateOne(
  //       { studentId: studentId }, // Match by custom string ID
  //       {
  //         $push: { collections: collectionData, },
  //         $set: { preDue: predue }
  //       } // Update preDue field
  //     );

  //     if (result.modifiedCount === 0) {
  //       return res.status(404).json({ error: 'Student not found or no changes made' });
  //     }

  //     res.status(200).json({ message: 'Collection updated successfully' });
  //   } catch (error) {
  //     console.error('Error updating collection:', error);
  //     res.status(500).json({ error: 'Failed to update collection' });
  //   }
  // });

  router.patch('/student/:id', async (req, res) => {
  const studentId = req.params.id;
  const collectionData = req.body;

  const predue = collectionData.preDue || 0;
  const collectionType = collectionData.name;

  try {
    // Try to push into existing entry if it exists
    const result = await studentsCollection.updateOne(
      {
        studentId: studentId,
        "collections.name": collectionType
      },
      {
        $push: {
          "collections.$.entries": collectionData
        },
        $set: {
          preDue: predue
        }
      }
    );

    // If no existing type found, insert a new one
    if (result.modifiedCount === 0) {
      const createNewCollection = await studentsCollection.updateOne(
        { studentId: studentId },
        {
          $push: {
            collections: {
              name: collectionType,
              entries: [collectionData]
            }
          },
          $set: {
            preDue: predue
          }
        }
      );

      if (createNewCollection.modifiedCount === 0) {
        return res.status(404).json({ error: "Student not found or collection insert failed" });
      }

      return res.status(200).json({ message: "New collection type created and data added" });
    }

    res.status(200).json({ message: "Collection updated successfully" });

  } catch (error) {
    console.error("Error updating collection:", error);
    res.status(500).json({ error: "Failed to update collection" });
  }
});

  return router;
};
