const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected");

        const doctorCollection = mongoose.connection.db.collection("doctor_data");
        global.doctordata = await doctorCollection.find({}).toArray();
        console.log("Fetched doctor Data:", global.doctordata);

    } catch (err) {
        console.error("Error connecting to the database:", err);
        throw err;
    }
};

module.exports = mongoDB;
