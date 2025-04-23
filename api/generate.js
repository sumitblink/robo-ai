import Replicate from "replicate";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { baseImage } = req.body;
  if (!baseImage) return res.status(400).json({ error: "No base image provided." });

  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

  try {
    const prediction = await replicate.predictions.create({
      version: "06d6fae3b75ab68a28cd2900afa6033166910dd09fd9751047043a5bbb4c184b",
      input: {
        image: baseImage,
        prompt: "futuristic robot with armor and glowing tech, sci-fi lighting",
        a_prompt: "sci-fi, cyberpunk, cinematic, vivid details",
        num_inference_steps: 30,
        scale: 9
      },
      webhook: `${process.env.PUBLIC_URL}/api/webhook`,
      webhook_events_filter: ["completed"]
    });

    // Instead of waiting, return the prediction ID
    res.status(200).json({ predictionId: prediction.id });

  } catch (err) {
    console.error("Prediction start failed:", err);
    res.status(500).json({ error: "Prediction start failed" });
  }
}
