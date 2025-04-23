import { useState } from 'react';

export default function RoboGenerator() {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const generateImage = async () => {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "your prompt here" })
    });
  
    const data = await res.json();
    const id = data.id; // ✅ This must match backend response key
  
    if (!id) {
      console.error("❌ ID is missing from /api/generate response");
      return;
    }
  
    // Start polling status
    checkStatus(id);
  };
  
  const checkStatus = async (id) => {
    const res = await fetch(`/api/status?id=${id}`);
    const data = await res.json();
  
    if (data.status === "done") {
      console.log("✅ Image URL:", data.imageUrl);
      // display imageUrl on your site
    } else if (data.status === "processing") {
      setTimeout(() => checkStatus(id), 2000); // poll again
    } else {
      console.error("❌ Image generation failed");
    }
  };
  

  return (
    <div style={{ padding: 20 }}>
      <h2>Robo Image Generator</h2>
      <input
        type="text"
        value={prompt}
        placeholder="Enter prompt..."
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "300px", marginRight: 10 }}
      />
      <button onClick={generateImage}>Generate</button>

      {loading && <p>Loading...</p>}
      {imageUrl && (
        <div>
          <h3>Generated Image:</h3>
          <img src={imageUrl} alt="Generated" style={{ width: "300px" }} />
        </div>
      )}
    </div>
  );
}
