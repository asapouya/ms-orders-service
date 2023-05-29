const config = require("config");

class RabbitMQConnection {

    // static connection = undefined;
    
    constructor() {
        const instance = this.constructor.instance;
        if(instance){
            return instance;
        }
        this.constructor.instance = this;
    }

    async connect() {
        if(RabbitMQConnection.connection){
            return RabbitMQConnection.connection;
        }
        RabbitMQConnection.connection = await require("amqplib").connect("amqp://localhost");
        console.log('\x1b[33m%s\x1b[0m', "Connected to rabbitMQ.");
    }

    get getConnection() {
        return RabbitMQConnection.connection
    }
}

module.exports = RabbitMQConnection;