
const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = (accountDB) => {
    const router = express.Router();
    const accountExpenses = accountDB.collection('expenses');
    const sourceExpenses = accountDB.collection('expensesSource');


    /* this route will be started with '/collections' */




    // 📌 Create expenses category
    router.post('/expenses-category', async (req, res) => {
        try {
            const newExpensesCat = req.body;
            const result = await sourceExpenses.insertOne(newExpensesCat);
            console.log('New collection added:', result);
            res.status(201).json({ message: 'expenses category added successfully', id: result.insertedId });
        } catch (error) {
            console.error('Error adding expenses category:', error);
            res.status(500).json({ error: 'Failed to add expenses category' });
        }
    });

    // 📌 Get All expenses category
    router.get('/expenses-category', async (req, res) => {
        try {
            const collections = await sourceExpenses.find({}).toArray();
            res.status(200).json(collections);
        } catch (error) {
            console.error('Error fetching sourceExpenses:', error);
            res.status(500).json({ error: 'Failed to fetch sourceExpenses' });
        }
    }
    );

    // 📌 Get All expenses

    router.get('/', async (req, res) => {
        try {
            const expenses = await accountExpenses.find({}).toArray();
            res.status(200).json(expenses);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            res.status(500).json({ error: 'Failed to fetch expenses' });
        }   
    });

    // 📌 Post new expense
    // s
    router.post('/', async (req, res) => {
        try {
            const newExpense = req.body;
            const result = await accountExpenses.insertOne(newExpense);
            console.log('New expense added:', result);
            res.status(201).json({ message: 'Expense added successfully', id: result.insertedId });
        } catch (error) {
            console.error('Error adding expense:', error);
            res.status(500).json({ error: 'Failed to add expense' });
        }
    }
    );
    // 📌 Get expense by ID



    // // post new collection category
    // router.post('/collection-category', async (req, res) => {
    //     try {
    //         const newCategory = req.body;
    //         const result = await sourceCollection.insertOne(newCategory);
    //         console.log('New collection category added:', result);
    //         res.status(201).json({ message: 'Collection category added successfully', id: result.insertedId });
    //     } catch (error) {
    //         console.error('Error adding collection category:', error);
    //         res.status(500).json({ error: 'Failed to add collection category' });
    //     }
    // }
    // );



    // // 📌 Get All Collection Categories
    // router.get('/collection-category', async (req, res) => {
    //     try {
    //         const categories = await sourceCollection.find({}).toArray();
    //         res.status(200).json(categories);
    //     } catch (error) {
    //         console.error('Error fetching collection categories:', error);
    //         res.status(500).json({ error: 'Failed to fetch collection categories' });
    //     }
    // });


    // post new collection of student by id by patch method


    return router;
};
