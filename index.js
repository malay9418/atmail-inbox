const express = require("express");
const path = require("path");

const app = express();
const TESTMAIL_API_KEY = process.env.TESTMAIL_API_KEY;
const TESTMAIL_NAMESPACE = process.env.TESTMAIL_NAMESPACE;
const port = process.env.PORT || 8080;

// Function to generate a random tag of 6 characters
const generateRandomTag = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve index.html on root path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve JSON response with generated email on /new path
app.get("/new", (req, res) => {
    const randomTag = generateRandomTag(6);
    const email = `${TESTMAIL_NAMESPACE}+${randomTag}@inbox.testmail.app`;
    res.json({ email });
});

// Handle mails retrieval logic on /mails path
app.get("/mails", async (req, res) => {
    const tag = req.query.tag;
    console.log(tag);
    if (!tag) {
        return res.status(400).send({ error: "Invalid email" });
    }
    const reqUrl = `https://api.testmail.app/api/json?apikey=${TESTMAIL_API_KEY}&namespace=${TESTMAIL_NAMESPACE}&tag=${tag}`;

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(reqUrl);
        if (!response.ok) {
            console.log("Network is not ok");
            res.status(500).send({ error: "Failed to fetch emails" });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Running on port ${port}.`);
});

module.exports = app;
