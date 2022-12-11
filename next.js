const axios = require("axios");
const { Storage } = require('@google-cloud/storage');

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

let fetchReport = async(id) => {
    const resp = await assembly.get(`/transcript/${id}`);
    console.log(resp.data.status);
    return resp;
}

let validate = result => result.data.status == 'processing' || result.data.status == "queued" ;

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

async function transcript() {
    await storage.bucket("minutescypher").file("a.mp3").makePublic();
    const res = await assembly
        .post("/transcript", {
            audio_url: "https://storage.googleapis.com/storage/v1/b/minutescypher/o/a.mp3?alt=media"
        })
    console.log(res.data);
    const id = res.data.id
    console.log(id);
    let resp = await poll(fetchReport,validate,3000,id)
    console.log(resp.data)
}

transcript().catch(console.error);
