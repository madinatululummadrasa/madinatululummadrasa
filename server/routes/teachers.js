const express = require('express');

module.exports = (db) => {
    const router = express.Router();
    const teachersCollection = db.collection('teachers');

    // Create Teacher so the
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

    router.patch('/teacher/:id', async (req, res) => {
        const teachersId = req.params.id;
        const expenseData = req.body;  
       if(!expenseData || !expenseData.name || !expenseData.amount) {
        return res.status(400).json({ error: 'Invalid expense data' });
       }else{
        console.log(expenseData, teachersId);
       }

        const predue = expenseData.preDue || 0; // Default to 0 if not provided
        const ExpenseType = expenseData.name;
    
        
        try {
            //  Try to push into existing entry if exist
            const result = await teachersCollection.updateOne(
                {teachersId: teachersId, "expenses.name": ExpenseType},
                {$push:{"expenses.$.entries": expenseData}, $set: { preDue: predue } }

            );
            if(result.modifiedCount === 0) {
               const createNewExpenseCollection = await teachersCollection.updateOne(
                {teachersId: teachersId},
                {$push:{
                    expenses:{
                        name: ExpenseType,
                        entries: [expenseData],
                    }
                },
            
                $set: { preDue: predue }
                }
               )

               if(createNewExpenseCollection.modifiedCount === 0) {
                    return res.status(404).json({ error: 'Teacher not found or no changes made' });
                }
                return res.status(200).json({ message: 'New expense collection created successfully' });

            }
        } catch (error) {
            console.error('Error updating collection:', error);
            res.status(500).json({ error: 'Failed to update collection' }); 
            
        }
    })
    return router;
};
