import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const generateImage = async () => {
    setLoading(true);
    setImageUrl(null);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    if (data.imageUrl) {
      setImageUrl(data.imageUrl);
    } else {
      console.error("❌ Error:", data.error);
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <h1>🤖 Generate Robo Character</h1>
      <input
        type="text"
        placeholder="Enter your prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={generateImage} disabled={loading}>
        {loading ? "Generating..." : "Generate"}
      </button>

      {imageUrl && (
        <div>
          <h3>Result:</h3>
          <img src={imageUrl} alt="Generated Robo" style={{ width: "300px" }} />
        </div>
      )}
    </div>
  );
}

export default App;
