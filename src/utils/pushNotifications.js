import axios from "axios";

export const pushNotification = async (notificationData) => {
  return fetch(process.env.FCM_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `key=${process.env.SERVER_KEY}`,
    },
    body: JSON.stringify(notificationData),
  })
    .then((response) => response.json())
    .then((data) => {
      return true;
    })
    .catch((error) => {
      return error;
    });
};
