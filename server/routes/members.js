const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (accountDB) => {
    const router = express.Router();
    const membersCollection = accountDB.collection('members');



    /* this route will be started with '/collections' */




    // 📌 Create Academic Record
    router.post('/', async (req, res) => {
        try {
            const newMember = req.body;
            const result = await membersCollection.insertOne(newMember);
            console.log('New member added:', result);
            res.status(201).json({ message: 'Member added successfully', id: result.insertedId });
        } catch (error) {
            console.error('Error adding member:', error);
            res.status(500).json({ error: 'Failed to add member' });
        }
    });

    // 📌 Get All Collections
    router.get('/', async (req, res) => {
        try {
            const members = await membersCollection.find({}).toArray();
            res.status(200).json(members);
        } catch (error) {
            console.error('Error fetching members:', error);
            res.status(500).json({ error: 'Failed to fetch members' });
        }
    }
    );

    router.patch('/:id', async (req, res) => {
        const { id } = req.params;
        const { name, contact, nidNumber, address, fixedAmount, status } = req.body;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        try {
            const updateResult = await membersCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        name,
                        contact,
                        nidNumber,
                        address,
                        fixedAmount,
                        status,
                        updatedAt: new Date(), // Add updatedAt field
                    },
                }
            );

            if (updateResult.modifiedCount === 0) {
                return res.status(404).json({ message: 'Member not found or already up to date' });
            }

            res.status(200).json({ message: 'Member updated successfully' });
        } catch (error) {
            console.error('Error updating member:', error);
            res.status(500).json({ error: 'Failed to update member' });
        }
    }
    );

    
    // ✅ Delete Member by ID
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        try {
            const deleteResult = await membersCollection.deleteOne({ _id: new ObjectId(id) });
            if (deleteResult.deletedCount === 0) {
                return res.status(404).json({ message: 'Member not found' });
            }
            res.status(200).json({ message: 'Member deleted successfully' });
        } catch (error) {
            console.error('Error deleting member:', error);
            res.status(500).json({ error: 'Failed to delete member' });
        }
    });





    return router;
};
