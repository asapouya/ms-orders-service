const {createContainer, Lifetime, asClass, InjectionMode} = require("awilix");
const BrokerRepo = require("./repositories/broker.repo");
const OrdersService = require("./services/orders.service");
const OrdersController = require("./controllers/orders.controllers");
const RabbitMQConnection = require("./repositories/rabbitmq.connection");

const container = createContainer({
    injectionMode: InjectionMode.PROXY
});

function setup() {
    container.register({
        BrokerRepo: asClass(BrokerRepo),
        OrdersService: asClass(OrdersService),
        OrdersController: asClass(OrdersController),
        RabbitMQConnection: asClass(RabbitMQConnection).singleton(),
    },{
        lifetime: Lifetime.TRANSIENT
    })
}

module.exports = {container, setup};   