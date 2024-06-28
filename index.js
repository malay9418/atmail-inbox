const express = require("express");

const app = express();
app.use(express.json());
const TESTMAIL_API_KEY = process.env.TESTMAIL_API_KEY;
const TESTMAIL_NAMESPACE = process.env.TESTMAIL_NAMESPACE;

app.get("/", (req, res) => {
    const tag = req.query.tag;
    if(!tag) {
        return res.status(400).send({ error: "Invalid email" });
    }
    const reqUrl = `https://api.testmail.app/api/json?apikey=${TESTMAIL_API_KEY}&namespace=${TESTMAIL_NAMESPACE}&tag=${tag}`
    // res.json({
    //     "url":tag
    // });
    res.send(`<a href="${reqUrl}">Mails</a>`);
});

app.listen(5000, () => {
    console.log("Running on port 5000.");
});

module.exports = app;
