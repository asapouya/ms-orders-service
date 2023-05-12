const config = require("config");

class BrokerRepo {
    
    constructor(connectionString) {
        this.connection = null;
        this.channel = null;
        if(connectionString) this.connectionString = connectionString;
        else this.connection = config.get("broker_url");
        this.connect();
    }
    async connect() {
        try {
            this.connection = await require("amqplib").connect(this.connectionString);
            console.log("1. connected to rabbitMQ");
        } catch (err) {
            console.log(err);
        }
    }


    async createChannel() {
        this.channel = await this.connection.createChannel();
    }
    async createConfirmChannel() {
        this.channel = await this.connection.createConfirmChannel();
    }

    returnEvent(callBack) {
        this.channel.on("return", (message) => {
            console.log("...........");
            callBack(message);
        })
    }
    errorEvent(callBack) {
        this.channel.on("error", (err) => {
            callBack(err);
        })
    }

    async createExchange(exchangeType, exchangeName, options) {
        await this.channel.assertExchange(exchangeName, exchangeType, options);
        console.log("3. exchange created");
    }
    async createQueue(queueName, options) {
        await this.channel.assertQueue(queueName, options);
        console.log("4. queue created");
    }
    async bindQueueToExchange(queueName, exchangeName, bindingKey){
        await this.channel.bindQueue(queueName, exchangeName, bindingKey);
        console.log("5. queue binded to exchange");
    }
    publishMessage(exchangeName, message, routingKey, options) {
        return this.channel.publish(exchangeName, routingKey, Buffer.from(message), options); /**{ mandetory: true, immediate: false }**/
    }
    async waitForConfirms() {
        await this.channel.waitForConfirms();
    }
    async close() {
        await this.channel.close();
        await this.connection.close();
    }
    async listenForMessage(queueName, callBack) {
        await this.channel.consume(queueName, async (msg) => {
            await callBack(msg);
        });
    }
    async ack(msg) {
        await this.channel.ack(msg);
        console.log("message ackowleged.")
    }

    async noAck(msg) {
        await this.channel.nack(msg, false, true);
        console.log("message requeued.");
    }
}
module.exports = BrokerRepo;