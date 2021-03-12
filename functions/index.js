const functions = require("firebase-functions");
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors')

admin.initializeApp(functions.config().firebase);

const app = express();
app.use(cors());

const db = admin.firestore();

app.get('/users', async (req, res) => {
    try {
        const userQuerySnapshot = await db.collection('users').get();
        const users = [];
        userQuerySnapshot.forEach(
            (doc) => {
                users.push({
                    id: doc.id,
                    data: doc.data()
                });
            }
        );
        res.status(200).json(users);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post('/users', async (req, res) => {
    try {
        const user = await db.collection('users').add(req.body);
        res.status(201).send('Created a new user: ' + user.id);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.put('/users/:id', async (req, res) => {
    await db.collection('users').doc(req.params.id).set(req.body, { merge: true })
        .then(() => res.json({ id: req.params.userId }))
        .catch((error) => res.status(500).send(error))
});

app.delete('/users/:id', (req, res) => {
    db.collection('users').doc(req.params.id).delete()
        .then(() => res.status(204).send("Document successfully deleted!"))
        .catch(function (error) {
            res.status(500).send(error);
        });
});

const api = functions.https.onRequest(app)
module.exports = { api }
