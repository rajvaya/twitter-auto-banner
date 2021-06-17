const fs = require("fs");
const { config } = require("dotenv");
const { TwitterClient } = require("twitter-api-client");
const fetch = require("node-fetch");
const download = require("image-downloader");
const Konva = require("konva-node");
const { loadImage } = require("canvas");

config();

async function makeImage() {
  let stage = new Konva.Stage({
    width: 1500,
    height: 500,
  });

  let layer = new Konva.Layer();
  stage.add(layer);
  layer.add(
    new Konva.Rect({
      width: 1500,
      height: 500,
      fill: "#FFFFFF",
    })
  );

  Konva.Image.fromURL(
    "https://source.unsplash.com/random/1500x500",
    async function (image) {
      // image is Konva.Image instance
      layer.add(image);
      layer.add(
        new Konva.Text({
          width: 1300,
          x: 100,
          y: 100,
          fill: "#FFFFFF",
          stroke: "#000000",
          shadowColor: "#AABBCC",
          text: "This Banner Updates Automatically Currenlty Buildidng this so You May See Random Things here",
          fontSize: 60,
          fontFamily: "Calibri",
        })
      );
      layer.draw();
      var data = stage.toDataURL();
      // // console.log(data);

      // const options = {
      //   url: "https://" + data,
      //   dest: "image.jpg", // will be saved to /path/to/dest/image.jpg
      // };
      // await download
      //   .image(options)
      //   .then(({ filename }) => {
      //     console.log("Saved"); // saved to /path/to/dest/image.jpg
      //   })
      //   .catch((err) => console.error(err));

      const base64Data = data.substring("data:image/png;base64,".length);
      console.log("done base64 sent to API");
      await updateProfileBanner(base64Data);
    }
  );

  // // remove the data header

  // return base64Data;
}

const twitterClient = new TwitterClient({
  apiKey: process.env.ck2,
  apiSecret: process.env.cks2,
  accessToken: process.env.at2,
  accessTokenSecret: process.env.ats2,
});

async function updateProfileBanner(data) {
  // console.log(process.env.ck2);

  try {
    await twitterClient.accountsAndUsers.accountUpdateProfileBanner({
      banner: data,
    });
    // await twitterClient.accountsAndUsers.accountRemoveProfileBanner();
    console.log("done");
  } catch (err) {
    console.log(err);
  }
}

function readBase64File(path) {
  return fs.readFileSync(path, { encoding: "base64" });
}

async function setRandomBanner() {
  try {
    var url = "";

    await fetch(
      "https://source.unsplash.com/random/1500x500?nature,mountains,beach,abstarct,"
    )
      .then((res) => res)
      .then((body) => {
        url = body.url;
        console.log(body.url);
      });
    console.log(url);
    const options = {
      url: url,
      dest: "image.jpg", // will be saved to /path/to/dest/image.jpg
    };

    await download
      .image(options)
      .then(({ filename }) => {
        console.log("Saved to", filename); // saved to /path/to/dest/image.jpg
      })
      .catch((err) => console.error(err));

    var base64 = await readBase64File("image.jpg");
    await updateProfileBanner(base64);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  updateProfileBanner,
  readBase64File,
  setRandomBanner,
  makeImage,
};
