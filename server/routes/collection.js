const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (accountDB) => {
    const router = express.Router();
    const accountCollection = accountDB.collection('collections');
    const sourceCollection = accountDB.collection('collectionSource');



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


    // post new collection category
    router.post('/collection-category', async (req, res) => {
        try {
            const newCategory = req.body;
            const result = await sourceCollection.insertOne(newCategory);
            console.log('New collection category added:', result);
            res.status(201).json({ message: 'Collection category added successfully', id: result.insertedId });
        } catch (error) {
            console.error('Error adding collection category:', error);
            res.status(500).json({ error: 'Failed to add collection category' });
        }
    }   
    );
    // 📌 Get All Collection Categories
    router.get('/collection-category', async (req, res) => {
        try {
            const categories = await sourceCollection.find({}).toArray();
            res.status(200).json(categories);
        } catch (error) {
            console.error('Error fetching collection categories:', error);
            res.status(500).json({ error: 'Failed to fetch collection categories' });
        }
    });

    return router;
};
