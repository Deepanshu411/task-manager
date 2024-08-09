import mongoose from "mongoose";

function connectDatabase() {
    mongoose.connect(process.env.MONGO_URL)
}

export default connectDatabase