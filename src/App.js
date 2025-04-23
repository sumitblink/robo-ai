import React, { useState, useEffect } from "react";

const loadingTexts = [
  "⚙️ Warming up the metals...",
  "🔧 Gearing up the circuits...",
  "🛠️ Assembling your robo form...",
  "✨ Injecting sci-fi details...",
  "🧠 Booting up AI consciousness...",
  "📡 Syncing avatar core...",
];

export default function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);

  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        const index = (loadingTexts.indexOf(prev) + 1) % loadingTexts.length;
        return loadingTexts[index];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setGeneratedImage(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseImage: preview }),
      });
      const data = await res.json();
      setGeneratedImage(data.imageUrl);
    } catch (error) {
      alert("Failed to generate. Check console.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40, fontFamily: "sans-serif" }}>
      <h1>🤖 Robo Avatar Generator</h1>
      <p>Upload your photo and see your sci-fi transformation!</p>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br /><br />

      {preview && (
        <>
          <img src={preview} alt="preview" style={{ width: 200, borderRadius: 10 }} />
          <br /><br />
          <button onClick={handleGenerate} style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer"
          }}>
            🚀 Generate Robo Avatar
          </button>
        </>
      )}

      {loading && (
        <p style={{ marginTop: 20, fontWeight: "bold" }}>{loadingText}</p>
      )}

      {generatedImage && (
        <>
          <h3>Your Robo Avatar:</h3>
          <img src={generatedImage} alt="Generated" style={{ width: 300, borderRadius: 10 }} />
        </>
      )}
    </div>
  );
}
