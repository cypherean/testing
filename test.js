
//Create the audio tag
// var soundFile = document.createElement("audio");
// soundFile.preload = "auto";

// //Load the sound file (using a source element for expandability)
// var src = document.createElement("source");
// src.src = your_file + ".mp3";
// soundFile.appendChild(src);

// The ID of your GCS bucket
const bucketName = 'minutescypher';

// The contents that you want to upload
// const audioCtx = new AudioContext();
// const contents = new Audio("your_file.mp3");
// const contents = new Audio("your_file.mp3");
const contents = 'these are my contents aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

// The new ID for your GCS file
const destFileName = 'tada.mp3';

// Imports the Google Cloud Node.js client library
// import Storage from 'google-cloud/storage';
const { Storage } = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

async function uploadFromMemory() {
  await storage.bucket(bucketName).file(destFileName).save(contents);
  await storage.bucket(bucketName).file(destFileName).makePublic();
  console.log(
    `${destFileName} with contents ${contents} uploaded to ${bucketName}.`
  );
}

uploadFromMemory().catch(console.error);
