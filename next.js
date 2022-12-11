const axios = require("axios");
const { Storage } = require('@google-cloud/storage');
var express = require('express');
var multer = require('multer');
var app = express();
app.use(express.static('public'));


// Creates a client
const storage = new Storage();
// const poll = require("./tr.js");
const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: "cfb3c6f4e6dc471bb0aef255ff0279d6",
        "content-type": "application/json",
    },
});

let fetchReport = async (id) => {
    const resp = await assembly.get(`/transcript/${id}`);
    console.log(resp.data.status);
    return resp;
}

let validate = result => result.data.status == 'processing' || result.data.status == "queued";

const poll = async (fn, fnCondition, ms, id) => {
    let result = await fn(id);
    while (fnCondition(result)) {
        await wait(ms);
        result = await fn(id);
        console.log(result.data.status)
    }
    return result;
};

const wait = async (ms = 1000) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

async function transcript(req, fn) {
    const res = await assembly
        .post("/transcript", {
            audio_url: "https://storage.googleapis.com/storage/v1/b/minutescypher/o/" + fn + "?alt=media",
            // Sentiment Analysis
            sentiment_analysis: req.Sentimental,
            // Summarization
            summarization: req.Summarisation,
            summary_model: "informative",
            summary_type: "bullets",
            // Topic Detection
            iab_categories: req.Topic,
            // Content Moderation
            content_safety: req.Moderation,
            // Detect imp phrases
            auto_highlights: req.Phrases,
            // PII redaction
            redact_pii: req.PII,
            redact_pii_policies: [
                "money_amount",
                "number_sequence",
                "person_name",
                "banking_information"
            ]
        })
    console.log(res.data);
    const id = res.data.id
    console.log(id);
    let resp = await poll(fetchReport, validate, 3000, id)
    console.log(resp.data)
    return resp.data
}

var upload = multer({ dest: __dirname + '/public/uploads/' });
var type = upload.single('upl');

app.get('/', function (req, res) {
    res.send('Welcome Home');
});
app.post('/audio', type, async function (req, res) {
    console.log(req.body);
    console.log(req.file);

    let bucketName = "minutescypher";
    const options = {
        destination: req.body.Filename,
    }
    await storage.bucket(bucketName).upload(req.file.path, options);
    await storage.bucket(bucketName).file(options.destination).makePublic();
    console.log("file is uploaded and made public");
    let resp = await transcript(req.body, options.destination);
    console.log("Aviral")
    console.log(resp)
    res.json(resp); 
});
// Launch server
app.listen(5050, function () {
    console.log('Example app listening on port 5050!');
});
