import express from 'express';

import Task from '../models/task.js';
import User from '../models/user.js';
import auth from '../middleware/auth.js';

const routes = express.Router();

routes.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        const result = await task.save();
        res.status(201).send(result);
    }catch(err) {
        res.status(400).send(`Error: ${err.message}`);
    };
});

routes.get('/tasks', auth, async (req, res) => {
    try {
        const match = {};
        const sort = {};

        if (req.query.completed) {
            match.completed = req.query.completed === 'true';
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }
        
        const user = await User.find({ _id: req.user._id }).populate({
            path: 'tasks',
            match,
            options: {
                limit: req.query.limit,
                skip: req.query.skip,
                sort
            }
        })
        res.status(200).send(user[0].tasks);

    } catch(err) {
        res.status(500).send(`Error: ${err.message}`);
    }
});

routes.get('/tasks/:id', auth, async (req, res) => {
    const id = req.params.id
    try {
        const task = await Task.findOne({ _id: id, owner: req.user._id });
        if (!task) {
            return res.status(404).send('Error: Task not found!');
        }
        res.status(200).send(task);
    } catch(err) {
        res.status(500).send(`Error: ${err.message}`);
    }
});

routes.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send('Error: Ivalid field!');
    }

    try {
        const id = req.params.id;
        const task = await Task.findOne({ _id: id, owner: req.user._id });
        if (!task) {
            return res.status(404).send('Error: task not found!');
        };
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        res.status(200).send(task);
    } catch(err) {
        res.status(400).send(`Error: ${err.message}`);
    }
});

routes.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
        if (!task) {
            res.status(400).send('Error: Task not found');
        }
        res.status(200).send('Task successfully deleted!');
    } catch(err) {
        res.status(500).send(`Error: ${err}`);
    }
});

export default routes;