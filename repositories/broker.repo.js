const config = require("config");

class BrokerRepo {
    
    constructor() {
        //singleton
        const instance = this.constructor.instance;
        if(instance) return instance;
        
        this.connection = null;
        this.channel = null;
        this.connectionString = config.get("broker_url");
        this.connect();

        this.constructor.instance = this;
    }

    connect = async () => {
        try {
            this.connection = await require("amqplib").connect(this.connectionString);
            console.log('\x1b[33m%s\x1b[0m', "1. connected to rabbitMQ");
            console.log(this.connection)
        } catch (err) {
            console.log(err);
        }
    }

    createChannel = async () => {
        this.channel = await this.connection.createChannel();
    }

    createConfirmChannel = async () => {
        this.channel = await this.connection.createConfirmChannel();
    }

    returnEvent = (callBack) => {
        this.channel.on("return", (message) => {
            console.log("...........");
            callBack(message);
        })
    }

    errorEvent = (callBack) => {
        this.channel.on("error", (err) => {
            callBack(err);
        })
    }

    createExchange = async (exchangeType, exchangeName, options) => {
        await this.channel.assertExchange(exchangeName, exchangeType, options);
        console.log("3. exchange created");
    }

    createQueue = async (queueName, options) => {
        await this.channel.assertQueue(queueName, options);
        console.log("4. queue created");
    }

    bindQueueToExchange = async (queueName, exchangeName, bindingKey) => {
        await this.channel.bindQueue(queueName, exchangeName, bindingKey);
        console.log("5. queue binded to exchange");
    }

    publishMessage = (exchangeName, message, routingKey, options) => {
        return this.channel.publish(exchangeName, routingKey, Buffer.from(message), options); /**{ mandetory: true, immediate: false }**/
    }

    waitForConfirms = async () => {
        await this.channel.waitForConfirms();
    }

    close = async () => {
        await this.channel.close();
        await this.connection.close();
    }

    listenForMessage = async (queueName, callBack) => {
        await this.channel.consume(queueName, async (msg) => {
            await callBack(msg);
        });
    }

    ack = async (msg) => {
        await this.channel.ack(msg);
        console.log("message ackowleged.")
    }

    noAck = async (msg) => {
        await this.channel.nack(msg, false, true);
        console.log("message requeued.");
    }
}
module.exports = BrokerRepo;