import { timer, webhookUrl } from "../../config";
import checkStatus from "./checkStatus";
import axios from "axios";

export default async function statusAlerts() {
  console.log("Starting status alerts...");

  let alerted: string[] = [];

  setInterval(async () => {
    let res = await checkStatus();

    for (let i of res) {
      if (i.status === "OFFLINE") {
        if (!alerted.includes(i.name)) {
          alerted.push(i.name);
          console.log(`${i.time} - ${i.name} is offline!`);

          let embed = {
            title: "Service Offline",
            description: `\`${i.name}\` is offline!`,
            fields: [
              {
                name: "Time",
                value: i.time,
              },
              {
                name: "Status",
                value: i.status,
              },
            ],
            color: 0xff0000,
          };

          await axios.post(webhookUrl, {
            embeds: [embed],
          });
        }
      }

      if (i.status === "ONLINE") {
        if (alerted.includes(i.name)) {
          console.log(`${i.time} - ${i.name} is back online!`);
          alerted = alerted.filter((x) => x !== i.name);

          let embed = {
            title: "Service Back Online",
            description: `\`${i.name}\` is back online!`,
            fields: [
              {
                name: "Time",
                value: i.time,
              },
              {
                name: "Status",
                value: i.status,
              },
            ],
            color: 0x00ff00,
          };

          await axios.post(webhookUrl, {
            embeds: [embed],
          });
        }
      }
    }
  }, timer);
}
