import mqConnection from "./conn";

export type INotification = {
  title: string;
  type: string;
  description: string;
  schedule?: string;
};
const NOTIFICATION_QUEUE = "hello";
export const sendNotification = async (
  notification: INotification,
  routingKey: string
) => {
  await mqConnection.sendToQueue(routingKey, notification);

  console.log(`Sent the notification to consumer`);
};
