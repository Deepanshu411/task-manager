import mongoose from "mongoose";

function connectDatabase() {
    mongoose.connect('mongodb://127.0.0.1:27017/task-manager')
}

export default connectDatabase