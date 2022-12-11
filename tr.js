const axios = require("axios");

const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: "cfb3c6f4e6dc471bb0aef255ff0279d6",
        "content-type": "application/json",
    },
});

const poll = async (fn, fnCondition, ms) => {
    let result = await fn();
    while (fnCondition(result)) {
        await wait(ms);
        result = await fn();
    }
    return result;
};

const wait = async (ms = 1000) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};


// let response = poll(fetchReport, validate, 3000);