const Orders = require("../models/orders.model");

class MongoRepo {
    async findOne(filters) {
        return await Orders.findOne(filters);
    }
    async deleteMany(filters) {
        return await Orders.deleteMany(filters);
    }
}

//extract database queries here.
module.exports = MongoRepo;