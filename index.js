const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
const TESTMAIL_API_KEY = process.env.TESTMAIL_API_KEY;
const TESTMAIL_NAMESPACE = process.env.TESTMAIL_NAMESPACE;

app.get("/", async (req, res) => {
    const tag = req.query.tag;
    console.log(tag);
    if (!tag) {
        return res.status(400).send({ error: "Invalid email" });
    }
    const reqUrl = `https://api.testmail.app/api/json?apikey=${TESTMAIL_API_KEY}&namespace=${TESTMAIL_NAMESPACE}&tag=${tag}`;
    
    try {
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

app.listen(5000, () => {
    console.log("Running on port 5000.");
});

module.exports = app;
