const express = require("express");

const app = express();
app.use(express.json());
const TESTMAIL_API_KEY = process.env.TESTMAIL_API_KEY;
const TESTMAIL_NAMESPACE = process.env.TESTMAIL_NAMESPACE;
const port = process.env.PORT || 8080

const generateRandomTag = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

app.get("/", async (req, res) => {
    const tag = req.query.tag;
    if (!tag) {
        return res.status(400).send({ error: "Invalid email" });
    }
    const reqUrl = `https://api.testmail.app/api/json?apikey=${TESTMAIL_API_KEY}&namespace=${TESTMAIL_NAMESPACE}&tag=${tag}`;

    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(reqUrl);
        if (!response.ok) {
            console.log("Network is not ok");
            res.status(500).send({ error: error.message });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get("/new", (req, res) => {
    const randomTag = generateRandomTag(6);
    const email = `${TESTMAIL_NAMESPACE}.${randomTag}@inbox.testmail.app`;
    res.json({ mail: email });
});

app.listen(port, () => {
    console.log("Running on port 5000.");
});

module.exports = app;
