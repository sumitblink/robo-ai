import Replicate from "replicate";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  try {
    const output = await replicate.run(
      "black-forest-labs/flux-schnell:latest",
      {
        input: {
          prompt,
          aspect_ratio: "9:16",
          prompt_upsampling: true,
        },
      }
    );

    res.status(200).json({ imageUrl: output[0] });

  } catch (error) {
    console.error("Replicate API Error:", error);
    res.status(500).json({ error: error.message });
  }
}
