import React, { useState, useEffect } from "react";

const loadingTexts = [
  "Warming up the exoskeleton...",
  "Calibrating AI circuits...",
  "Forging cybernetic limbs...",
  "Activating mech-core...",
  "Rendering your Robo Avatar..."
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        const next = loadingTexts[(loadingTexts.indexOf(prev) + 1) % loadingTexts.length];
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async () => {
    setLoading(true);
    setImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const { predictionId } = await res.json();

      const poll = async () => {
        const status = await fetch(`/api/status?id=${predictionId}`);
        const data = await status.json();

        if (data.status === "done") {
          setImage(data.imageUrl);
          setLoading(false);
        } else if (data.status === "failed") {
          alert("❌ Generation failed");
          setLoading(false);
        } else {
          setTimeout(poll, 3000);
        }
      };

      poll();

    } catch (err) {
      alert("Error generating image.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: 40, fontFamily: "sans-serif" }}>
      <h1>🤖 Robo Avatar Generator (Flux 1.1)</h1>
      <p>Type a sci-fi robo avatar prompt below:</p>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., Robo Cop standing in rain"
        style={{ width: "80%", padding: 10, fontSize: 16 }}
      />
      <br /><br />
      <button
        onClick={handleSubmit}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        Generate 🚀
      </button>

      {loading && (
        <p style={{ marginTop: 20, fontStyle: "italic", fontWeight: "bold" }}>{loadingText}</p>
      )}

      {image && (
        <div style={{ marginTop: 40 }}>
          <h3>🖼️ Robo Avatar:</h3>
          <img src={image} alt="Generated Robo Avatar" style={{ maxWidth: 400, borderRadius: 10 }} />
        </div>
      )}
    </div>
  );
}
