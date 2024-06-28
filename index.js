const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(express.json());

const TESTMAIL_API_BASE_URL = 'https://api.testmail.app/api';

app.get("/", (req, res) => {
    res.send("Express on Vercel");
});

// Endpoint to get mails for a namespace
app.get("/mails", async (req, res) => {
    const namespace = req.query.namespace;

    if (!namespace) {
        return res.status(400).send({ error: "Namespace is required" });
    }

    try {
        const response = await fetch(`${TESTMAIL_API_BASE_URL}/mails?namespace=${namespace}`, {
            headers: {
                'Authorization': `Bearer ${process.env.TESTMAIL_API_KEY}`
            }
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching mails:", error);
        res.status(500).send({ error: "Failed to fetch mails" });
    }
});

// Endpoint to create a new mail namespace
app.post("/newmail", async (req, res) => {
    const { namespace } = req.body;

    if (!namespace) {
        return res.status(400).send({ error: "Namespace is required" });
    }

    try {
        const response = await fetch(`${TESTMAIL_API_BASE_URL}/newmail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TESTMAIL_API_KEY}`
            },
            body: JSON.stringify({ namespace })
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error creating new mail:", error);
        res.status(500).send({ error: "Failed to create new mail" });
    }
});

app.listen(5000, () => {
    console.log("Running on port 5000.");
});

module.exports = app;
