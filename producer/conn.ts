import client, { Connection, Channel, ConsumeMessage } from "amqplib";

class RabbitMQConnection {
  connection!: Connection;
  channel!: Channel;
  private connected!: Boolean;

  async connect() {
    if (this.connected && this.channel) return;
    else this.connected = true;

    try {
      console.log(`⌛️ Connecting to Rabbit-MQ Server`);
      this.connection = await client.connect(
        `amqp://${"user"}:${"pwd"}@${"url"}:5672`
      );

      console.log(`✅ Rabbit MQ Connection is ready`);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange("xxx", "topic", { durable: false });
      console.log(`🛸 Created RabbitMQ Channel successfully`);
    } catch (error) {
      console.error(error);
      console.error(`Not connected to MQ Server`);
    }
  }

  async sendToQueue(rountingKey: string, message: any) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel.publish(
        "xxx",
        rountingKey,
        Buffer.from(JSON.stringify(message))
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

const mqConnection = new RabbitMQConnection();

export default mqConnection;
