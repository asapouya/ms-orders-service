const {createContainer, asClass, InjectionMode} = require("awilix");
const BrokerRepo = require("./repositories/broker.repo");
const OrdersService = require("./services/orders.service");
const OrdersController = require("./controllers/orders.controllers");
const RabbitMQConnection = require("./repositories/rabbitmq.connection");

const container = createContainer({
    injectionMode: InjectionMode.PROXY
});

function setup() {
    container.register({
        RabbitMQConnection: asClass(RabbitMQConnection).singleton(),
        BrokerRepo: asClass(BrokerRepo),
        OrdersService: asClass(OrdersService),
        OrdersController: asClass(OrdersController)
    })
}

module.exports = {container, setup};   