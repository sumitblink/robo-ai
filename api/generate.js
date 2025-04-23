import Replicate from "replicate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { baseImage } = req.body;
  if (!baseImage) {
    return res.status(400).json({ error: "No base image provided." });
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    // 1. Generate Robo Image from Base Image
    const roboOutput = await replicate.run(
      "lucataco/sdxl-controlnet:06d6fae3b75ab68a28cd2900afa6033166910dd09fd9751047043a5bbb4c184b",
      {
        input: {
          image: baseImage,
          prompt: "futuristic robot, cinematic lighting, sci-fi suit",
          num_inference_steps: 30,
          a_prompt: "cyberpunk, cinematic, futuristic details",
          scale: 9,
        },
      }
    );

    const roboImage = Array.isArray(roboOutput) ? roboOutput[0] : roboOutput;
    if (!roboImage || !roboImage.startsWith("http")) {
      return res.status(500).json({ error: "Invalid robo image output" });
    }

    // 2. Face Swap: Use baseImage (user face) as source, roboImage as target
    const faceSwapOutput = await replicate.run(
      "codeplugtech/face-swap:278a81e7ebb22db98bcba54de985d22cc1abeead2754eb1f2af717247be69b34",
      {
        input: {
          input_image: roboImage,
          swap_image: baseImage
        }
      }
    );

    const swappedImage = Array.isArray(faceSwapOutput) ? faceSwapOutput[0] : faceSwapOutput;

    if (!swappedImage || !swappedImage.startsWith("http")) {
      // fallback to robo image
      return res.status(200).json({
        imageUrl: roboImage,
        message: "FaceSwap failed, using robo image fallback.",
      });
    }

    return res.status(200).json({ imageUrl: swappedImage });

  } catch (err) {
    console.error("🔥 Replicate Error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}
