
import { EventEmitter } from "events";

export const webhooks = new EventEmitter();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Invalid method" });

  const prediction = req.body;

  // Emit prediction back to whoever is listening
  webhooks.emit(prediction.id, prediction);

  res.status(200).json({ success: true });
}
