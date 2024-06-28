const express = require("express");
const path = require("path");
const { default: fetch } = require("node-fetch");

const app = express();
const port = process.env.PORT || 8080;
const TESTMAIL_NAMESPACE = process.env.TESTMAIL_NAMESPACE;

// Function to generate a random tag of 6 characters
const generateRandomTag = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Serve index.html on root path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint to fetch current namespace
app.get("/namespace", (req, res) => {
    res.json({ namespace: TESTMAIL_NAMESPACE });
});

// Endpoint to fetch mails based on tag
app.get("/mails", async (req, res) => {
    const tag = req.query.tag;
    if (!tag) {
        return res.status(400).send({ error: "Invalid tag" });
    }

    try {
        const reqUrl = `https://api.testmail.app/api/json?namespace=${TESTMAIL_NAMESPACE}&tag=${tag}`;
        const response = await fetch(reqUrl);
        if (!response.ok) {
            console.log("Failed to fetch emails:", response.statusText);
            res.status(500).send({ error: "Failed to fetch emails" });
            return;
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Failed to fetch emails:', error);
        res.status(500).send({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Running on port ${port}.`);
});

module.exports = app;
