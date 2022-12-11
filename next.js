const axios = require("axios");

const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        authorization: "cfb3c6f4e6dc471bb0aef255ff0279d6",
        "content-type": "application/json",
    },
});

async function transcript() {
    var result
    await assembly
        .post("/transcript", {
            audio_url: "https://storage.cloud.google.com/minutescypher/Zarre%20Zarre%20Mein%20Tera%20%20Aab%20o%20tabe%20chashm%20hai.mp3"
        })
        .then((res) => {
            console.log(res.data);
            const id = res.data.ID
            while (res.data.status != 'completed') {
                assembly
                    .get(`/transcript/${id}`)
                    .then((res) => {
                        console.log(res.data);
                        result = res.data;
                    })
                    .catch((err) => console.error(err));
            }
        })
        .catch((err) => console.error(err));

    console.log(
        `${destFileName} with contents ${contents} uploaded to ${bucketName}.`
    );
}

transcript().catch(console.error);
