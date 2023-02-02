const mongoose = require("mongoose");

async function connect(){
    try {
        await mongoose.connect("mongodb+srv://asapouya:Gozgoz1234@storiescluster.euhfaq8.mongodb.net/Orders?retryWrites=true&w=majority");
        console.info("connected to orders db.");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connect;