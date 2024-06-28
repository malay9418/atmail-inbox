const express = require("express");

const app = express();
app.use(express.json());
const TESTMAIL_API_KEY = process.env.TESTMAIL_API_KEY;

app.get("/", (req, res) => {
    const namespace = req.query.namespace;
    if(!namespace) {
        return res.status(400).send({ error: "Invalid email" });
    }
    res.json({
        "namespace":namespace
    });
});

app.listen(5000, () => {
    console.log("Running on port 5000.");
});

module.exports = app;
