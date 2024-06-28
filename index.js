const express = require("express");

const app = express();
const TESTMAIL_API_KEY = process.env.TESTMAIL_API_KEY;
console.log("api key is: ", TESTMAIL_API_KEY);

app.get("/", (req, res) => {
    res.send("Express on Vercel");
});

app.listen(5000, () => {
    console.log("Running on port 5000.");
});

module.exports = app;
