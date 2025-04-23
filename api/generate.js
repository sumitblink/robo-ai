import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  try {
    const prediction = await replicate.predictions.create({
      version: "8e8d73f4d2aee6100270cb9e7a2c68ba5bbf7e92c46ae14d6486719d1d232af1",
      input: {
        prompt,
        aspect_ratio: "9:16",
        prompt_upsampling: true,
        output_format: "png",
        output_quality: 100
      },
    });

    res.status(200).json({ id: prediction.id });

  } catch (error) {
    console.error("🚨 Generate Error:", error);
    res.status(500).json({ error: error.message });
  }
}
