import { interval } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";

export default class MessagesWidget {
  constructor(apiUrl, containerId, maxMessages = 15) {
    this.apiUrl = apiUrl;
    this.container = document.getElementById(containerId);
    this.subscription = null;
    this.maxMessages = maxMessages;
  }

  start() {
    const pollInterval = 3000;

    this.subscription = interval(pollInterval)
      .pipe(
        switchMap(() =>
          ajax.getJSON(this.apiUrl).pipe(
            map((response) => {
              if (
                response.status === "ok" &&
                Array.isArray(response.messages)
              ) {
                return response.messages;
              }
              return [];
            }),
            catchError(() => {
              return of([]);
            }),
          ),
        ),
      )
      .subscribe((messages) => {
        this.addMessages(messages);
      });
  }

  stop() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  addMessages(messages) {
    if (!messages || messages.length === 0) return;

    messages.forEach((message) => {
      this.addMessage(message);
    });

    this.limitMessages();
  }

  limitMessages() {
    const tbody = this.container.querySelector("tbody");
    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll("tr.message-row"));
    if (rows.length > this.maxMessages) {
      const rowsToRemove = rows.slice(this.maxMessages);
      rowsToRemove.forEach((row) => row.remove());
    }
  }

  addMessage(message) {
    const row = document.createElement("tr");
    row.className = "message-row";

    const fromCell = document.createElement("td");
    fromCell.className = "message-from";
    fromCell.textContent = message.from;

    const subjectCell = document.createElement("td");
    subjectCell.className = "message-subject";
    subjectCell.textContent = this.truncateSubject(message.subject);

    const receivedCell = document.createElement("td");
    receivedCell.className = "message-received";
    receivedCell.textContent = this.formatDate(message.received);

    row.appendChild(fromCell);
    row.appendChild(subjectCell);
    row.appendChild(receivedCell);

    const tbody = this.container.querySelector("tbody");
    if (tbody) {
      tbody.insertBefore(row, tbody.firstChild);
    }
  }

  truncateSubject(subject) {
    if (!subject) return "";
    if (subject.length <= 15) return subject;
    return subject.substring(0, 15) + "...";
  }

  formatDate(timestamp) {
    if (!timestamp) return "";

    const date = new Date(timestamp * 1000);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}.${month}.${year}`;
  }
}
