const config = require("config");

class RabbitMQConnection {
    constructor() {
        this.connection = null;
    }

    async connect() {
        try {
            if(!this.connection){
                this.connection = await require("amqplib").connect(config.get("broker_url"));
                console.log('\x1b[33m%s\x1b[0m', "Connected to rabbitMQ.");
            }
            return this.connection;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = RabbitMQConnection;