import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing prediction ID" });

  try {
    const prediction = await replicate.predictions.get(id);

    if (prediction.status === "succeeded") {
      const outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : null;
      return res.status(200).json({ status: "done", imageUrl: outputUrl });
    } else if (prediction.status === "failed") {
      return res.status(200).json({ status: "failed" });
    } else {
      return res.status(200).json({ status: "processing" });
    }

  } catch (error) {
    console.error("🚨 Status Error:", error);
    return res.status(500).json({ error: "Status check failed" });
  }
}
