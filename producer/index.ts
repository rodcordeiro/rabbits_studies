import mqConnection from "./conn";
import { INotification, sendNotification } from "./notification";

const send = async () => {
  await mqConnection.connect();

  const newNotification: INotification = {
    // schedule: "2024-05-29T19:27:00.000Z0000",
    type: "notification",
  } as INotification;

  sendNotification(
    {
      ...newNotification,
      title: "All Notifications",
      description: "Notificando todos os lugares",
    },
    "all.notification"
  );
  sendNotification(
    {
      ...newNotification,
      title: "PS Notifications",
      schedule: "2024-05-29T19:30:00",
      description: "Notificando apenas powershell",
    },
    "ps.notification"
  );
  sendNotification(
    {
      ...newNotification,
      title: "Node Notifications",
      description: "Notificando apenas no node",
    },
    "node.notification"
  );
};

send();
