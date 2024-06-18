import client, { Connection, Channel } from "amqplib";

type HandlerCB = (msg: string) => any;

const NOTIFICATION_QUEUE = "hello";

class RabbitMQConnection {
  connection!: Connection;
  channel!: Channel;
  queue!: client.Replies.AssertQueue;
  private connected!: Boolean;

  async connect(queue_name: string) {
    if (this.connected && this.channel) return;
    try {
      console.log(`⌛️ Connecting to Rabbit-MQ Server`);

      this.connection = await client.connect(
        `amqp://${"user"}:${"pwd"}@${"url"}:5672`
      );

      console.log(`✅ Rabbit MQ Connection is ready`);

      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange("xxx", "direct", { durable: false });
      this.queue = await this.channel.assertQueue(queue_name, {
        exclusive: true,
      });
      await this.channel.bindQueue(
        this.queue.queue,
        "xxx",
        "node_notification"
      );
      await this.channel.bindQueue(this.queue.queue, "xxx", "all_notification");

      console.log(`🛸 Created RabbitMQ Channel successfully`);

      this.connected = true;
    } catch (error) {
      console.error(error);
      console.error(`Not connected to MQ Server`);
    }
  }

  async consume(handleIncomingNotification: HandlerCB) {
    this.channel.consume(
      this.queue.queue,
      (msg) => {
        {
          if (!msg) {
            return console.error(`Invalid incoming message`);
          }
          // console.log(msg);
          handleIncomingNotification(msg?.content?.toString());
          this.channel.ack(msg);
        }
      },
      {
        noAck: false,
      }
    );
  }
}

const mqConnection = new RabbitMQConnection();

export default mqConnection;
