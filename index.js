const express = require("express");

const app = express();
app.use(express.json());
const TESTMAIL_API_KEY = process.env.TESTMAIL_API_KEY;
const TESTMAIL_NAMESPACE = process.env.TESTMAIL_NAMESPACE;
const port = process.env.PORT || 8080

app.get("/", async (req, res) => {
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
            res.status(500).send({ error: error.message });
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(port, () => {
    console.log("Running on port 5000.");
});

module.exports = app;
