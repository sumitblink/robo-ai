import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const prediction = await replicate.predictions.create({
      model: "black-forest-labs/flux-1.1-pro",
      input: {
        prompt: prompt,
        prompt_upsampling: true,
      },
      webhook: `${process.env.PUBLIC_URL}/api/webhook`,
      webhook_events_filter: ["completed"]
    });

    res.status(200).json({ predictionId: prediction.id });

  } catch (error) {
    console.error("🚨 Generate Error:", error);
    res.status(500).json({ error: "Prediction failed to start" });
  }
}
