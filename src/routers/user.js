import express from 'express';

import User from '../models/user.js';
import auth from '../middleware/auth.js';

const routes = express.Router();

routes.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    }catch(err) {
        res.status(400).send(`Error: ${err.message}`)
    };
});

routes.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
    } catch (err) {
        res.status(400).send(`${err.message}`)
    }
});

routes.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();

        res.status(200).send('Logged out successfully!');
    } catch (err) {
        res.status(500).send(`Error: ${err.message}`)
    }
});

routes.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send('Logged out from all devices!');
    } catch (err) {
        res.status(500).send(`Error: ${err.message}`)
    }
})

routes.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

routes.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send('Error: Ivalid field!');
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.status(200).send(req.user);
    } catch(err) {
        res.status(400).send(`Error: ${err.message}`);
    }
});

routes.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne();
        res.status(200).send('User successfully deleted!');
    } catch(err) {
        res.status(500).send(`Error: ${err.message}`);
    }
});

export default routes;