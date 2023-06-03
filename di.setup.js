const {createContainer, asClass, InjectionMode} = require("awilix");
const BrokerRepo = require("./repositories/rabbittmq.repo");
const OrdersService = require("./services/orders.service");
const OrdersController = require("./controllers/orders.controllers");
const RabbitMQConnection = require("./repositories/rabbitmq.connection");
const MongoConnection = require("./repositories/mongo.connection");
const MongoRepo = require("./repositories/mongo.repo.js");

const container = createContainer({
    injectionMode: InjectionMode.PROXY
});

function setup() {
    container.register({
        RabbitMQConnection: asClass(RabbitMQConnection).singleton(),
        MongoConnection: asClass(MongoConnection).singleton(),
        MongoRepo: asClass(MongoRepo),
        BrokerRepo: asClass(BrokerRepo),
        OrdersService: asClass(OrdersService),
        OrdersController: asClass(OrdersController)
    })
}

module.exports = {container, setup};   