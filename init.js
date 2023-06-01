const {container} = require("./di.setup");

module.exports = async () => {
    try {
        await container.resolve("MongoConnection").connect();
        await container.resolve("RabbitMQConnection").connect();
        container.resolve("OrdersController").handle_user_deletion();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }  
}