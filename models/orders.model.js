const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    bookId: {
        type: [Schema.Types.ObjectId],
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "fulfilled", "canceled"]
    }
})