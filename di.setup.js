const awilix = require("awilix");
const BrokerRepo = require("./repositories/broker.repo");
const OrdersService = require("./services/orders.service");
const OrdersController = require("./controllers/orders.controllers");

const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY
});

function setup() {
    container.register({
        BrokerRepo: awilix.asClass(BrokerRepo),
        OrdersService: awilix.asClass(OrdersService),
        OrdersController: awilix.asClass(OrdersController),
    })
}

module.exports = {container, setup};   