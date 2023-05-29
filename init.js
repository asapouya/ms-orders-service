const {container} = require("./di.setup");

module.exports = function() {
    container.resolve("RabbitMQConnection").connect().then(() => {
        console.log("............")
        container.resolve("OrdersController").handle_user_deletion();
    }).catch(err => console.log(err));
}