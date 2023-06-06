class MongoRepo {

    constructor({OrdersModel}) {
        this.Orders = OrdersModel;
    }

    orderFactory(order) {
        return new this.Orders(order)
    }
    async findOne(filters) {
        return await this.Orders.findOne(filters);
    }
    async find(filters) {
        return await this.Orders.find(filters);
    }
    async findById(id) {
        return await this.Orders.findById(id);
    }
    async deleteMany(filters) {
        return await this.Orders.deleteMany(filters);
    }
    async updateOne(filters, updateObj) {
        return await this.Orders.updateOne(filters, updateObj);
    }
    async findOneAndUpdate(filters, updateObj) {
        return await this.Orders.findOneAndUpdate(filters, updateObj);
    }
    async findByIdAndRemove(id) {
        return await this.Orders.findByIdAndRemove(id);
    }
    async findOneAndDelete(filters) {
        return await this.Orders.findOneAndDelete(filters);
    }
}

module.exports = MongoRepo;