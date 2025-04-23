import Replicate from "replicate";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "Missing prediction ID" });

  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

  try {
    const prediction = await replicate.predictions.get(id);

    if (prediction.status === "succeeded") {
      return res.status(200).json({ status: "done", imageUrl: prediction.output[0] });
    } else if (prediction.status === "failed") {
      return res.status(200).json({ status: "failed" });
    } else {
      return res.status(200).json({ status: "processing" });
    }

  } catch (err) {
    console.error("Status check failed:", err);
    res.status(500).json({ error: "Status fetch error" });
  }
}
