import express, { Request, Response } from "express";
import { port } from "../config";
import checkStatus from "./functions/checkStatus";
import statusAlerts from "./functions/statusAlerts";

let app = express();

app.get("/", async (req: Request, res: Response) => {
  let i = await checkStatus();

  return res.json(i);
});

app.listen(port, () => {
  console.log(`Status API listening at http://localhost:${port}`);
});

(async () => {
  statusAlerts();
})();
