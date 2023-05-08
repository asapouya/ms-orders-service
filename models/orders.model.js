const {Schema, model} = require("mongoose");

const ordersSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    bookId: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "fulfilled"],
        default: "pending"
    },
    dateOfpurchase: {
        type: Date,
        default: null
    }
});

const Orders = model("orders", ordersSchema);

module.exports = Orders;