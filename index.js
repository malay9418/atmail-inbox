const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 8080;
const TESTMAIL_NAMESPACE = process.env.TESTMAIL_NAMESPACE;
const TESTMAIL_API_KEY = process.env.TESTMAIL_API_KEY;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get("/namespace", (req, res) => {
    res.json({ namespace: TESTMAIL_NAMESPACE });
});

app.get("/mails", async (req, res) => {
    const tag = req.query.tag;
    if (!tag) {
        return res.status(400).send({ error: "Invalid tag" });
    }

    try {
        const fetch = (await import('node-fetch')).default;
        const reqUrl = `https://api.testmail.app/api/json?apikey=${TESTMAIL_API_KEY}&namespace=${TESTMAIL_NAMESPACE}&tag=${tag}`;
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
