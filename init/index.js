const mongoose = require("mongoose");
const initData = require("./data.js"); // Updated file extension
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("Connected to DB");
    return initDB(); // Call initDB after connecting to the database
  })
  .then(() => {
    console.log("Data was initialized");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/WanderNest");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "65ed59df724b5443ed3d4854" }))
  await Listing.insertMany(initData.data);
  console.log("data was initialized")
};

initDB();
