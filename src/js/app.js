import MessagesWidget from "./MessagesWidget.js";

const API_URL =
  typeof process !== "undefined" && process.env?.API_URL
    ? process.env.API_URL
    : "https://poling-backend.vercel.app/messages/unread";

document.addEventListener("DOMContentLoaded", () => {
  const widget = new MessagesWidget(API_URL, "messagesTable");
  widget.start();
});
