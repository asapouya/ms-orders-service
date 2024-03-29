const {createContainer, asClass, InjectionMode, asValue} = require("awilix");
const BrokerRepo = require("./repositories/rabbittmq.repo");
const OrdersService = require("./services/orders.service");
const OrdersController = require("./controllers/orders.controllers");
const RabbitMQConnection = require("./repositories/rabbitmq.connection");
const MongoConnection = require("./repositories/mongo.connection");
const MongoRepo = require("./repositories/mongo.repo.js");
const Orders = require("./models/orders.model");

const container = createContainer({
    injectionMode: InjectionMode.PROXY
});

async function diSetup() {

    const rabbitMQConnection = new RabbitMQConnection();
    const mongoConnection = new MongoConnection();
    await mongoConnection.connect();
    await rabbitMQConnection.connect();

    container.register({
        OrdersModel: asValue(Orders),
        RabbitMQConnection: asValue(rabbitMQConnection.getConnection),
        OrdersController: asClass(OrdersController),
        MongoRepo: asClass(MongoRepo),
        BrokerRepo: asClass(BrokerRepo),
        OrdersService: asClass(OrdersService),
    })
}

module.exports = {container, diSetup};   