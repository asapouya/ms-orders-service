const config = require("config");

class RabbitMQConnection {

    constructor() {
        const instance = this.constructor.instance
        if(instance) return instance;
        this.constructor.instance = this
    }
    
    async connect() {
        if(RabbitMQConnection.connection){
            return RabbitMQConnection.connection;
        }
        RabbitMQConnection.connection = await require("amqplib").connect(config.get("rabbitmq_url"));
        console.log('\x1b[33m%s\x1b[0m', "Connected to rabbitMQ.");
    }

    get getConnection() {
        if(!RabbitMQConnection) throw new Error("There is no connection!");
        return RabbitMQConnection.connection;
    }
}

module.exports = RabbitMQConnection;