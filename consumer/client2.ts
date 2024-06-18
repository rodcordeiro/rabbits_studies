import mqConnection from "./conn";
import { exec } from "node:child_process";

export type INotification = {
  title: string;
  description: string;
};
const handleIncomingNotification = (msg: string) => {
  try {
    const parsedMessage: INotification = JSON.parse(msg);
    exec(
      `Show-Notification -ToastTitle '${parsedMessage.title}' -ToastText "${parsedMessage.description}"`
    );
    console.log(parsedMessage);

    // Implement your own notification flow
  } catch (error) {
    console.error(`Error While Parsing the message`);
  }
};

const listen = async () => {
  await mqConnection.connect("client_2");

  await mqConnection.consume(handleIncomingNotification);
};

listen();
