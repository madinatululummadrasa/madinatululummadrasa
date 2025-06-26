const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (accountDB) => {
    const router = express.Router();
    const accountCollection = accountDB.collection('collectionSource');



    // 📌 Create Academic Record
    router.post('/', async (req, res) => {
        try {
            const newCollection = req.body;

            const result = await accountCollection.insertOne(newCollection);
            console.log('New collection added:', result);



            res.status(201).json({ message: 'Collection added successfully', id: result.insertedId });
        } catch (error) {
            console.error('Error adding collection:', error);
            res.status(500).json({ error: 'Failed to add collection' });
        }
    });

    // 📌 Get All Collections
    router.get('/', async (req, res) => {
        try {
            const collections = await moneyCollection.find({}).toArray();
            res.status(200).json(collections);
        } catch (error) {
            console.error('Error fetching collections:', error);
            res.status(500).json({ error: 'Failed to fetch collections' });
        }
    }
    );
    // 📌 Get Collection by ID

    return router;
};
