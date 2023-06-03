const Orders = require("../models/orders.model");

class MongoRepo {
    async findOne(filters) {
        return await Orders.findOne(filters);
    }
    async deleteMany(filters) {
        return await Orders.deleteMany(filters);
    }
    async updateOne (filters, updateObj) {
        return await Orders.updateOne(filters, updateObj);
    }
}

module.exports = MongoRepo;