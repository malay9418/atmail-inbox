const express = require("express");
const path = require("path");
const dotenv = require("dotenv");


dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const TESTMAIL_NAMESPACE = process.env.TESTMAIL_NAMESPACE;
const TESTMAIL_API_KEY = process.env.TESTMAIL_API_KEY;

function generateRandomTag() {
    const validCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = validCharacters.length;
    for (let i = 0; i < 6; i++) {
        result += validCharacters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function checkGeneratedTag(tag) {
    const validCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    if (!tag || tag.length !== 6) {
        return false;
    }

    for (let i = 0; i < tag.length; i++) {
        if (!validCharacters.includes(tag[i])) {
            return false;
        }
    }

    return true;
}


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'test.html'));
});

app.get("/new", (req, res) => {
    const newMail = `${TESTMAIL_NAMESPACE}.${generateRandomTag()}@inbox.testmail.app`;
    res.json({ mail: newMail });
});

app.get("/mails", async (req, res) => {
    const tag = req.query.tag;
    if (!checkGeneratedTag(tag)) {
        return res.status(400).send({ error: "Invalid mail" });
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
    console.log(`Running on port http://127.0.0.1:${port}`);
});

module.exports = app;
