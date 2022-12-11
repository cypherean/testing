const axios = require("axios");

const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: "cfb3c6f4e6dc471bb0aef255ff0279d6",
        "content-type": "application/json",
    },
});

const poll = async function (fn, fnCondition, ms) {
    let result = await fn();
    while (fnCondition(result)) {
        await wait(ms);
        result = await fn();
    }
    return result;
};

const wait = function (ms = 1000) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

let fetchReport = () => assembly
    .get(`/transcript/r7qqm1c706-b2b6-4b4e-bf9a-a72406a71350`)
    .then((res) => {
        console.log(res.data);
        // result = res.data;
    })
    .catch((err) => console.error(err));

let validate = result => result.data.status != 'completed';
let response = poll(fetchReport, validate, 3000);