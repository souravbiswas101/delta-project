const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL)
}

// const initDB = async ()=>{
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj)=>({
//         ...obj,
//         owner: '6a9c39057a862e44cf9a31ba'
//     }));
//     await Listing.insertMany(initData.data);

//     console.log("data was initialized");
// };

// initDB();

const initDB = async () => {
  await Listing.deleteMany({});
  
  // প্রতিটি data object-এর সাথে default geometry যোগ করা হচ্ছে
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "652d11933c1626f23c914392", // আপনার কাছে থাকা যেকোনো valid User ObjectId
    geometry: {
      type: "Point",
      coordinates: [77.2090, 28.6139] // Default coordinates (New Delhi / Kolkata / Dhaka)
    }
  }));

  await Listing.insertMany(initData.data);
  console.log("Data was initialized successfully!");
};

initDB();