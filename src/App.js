import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    setImageUrl(null);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    const id = data.id;

    if (!id) {
      console.error("❌ No ID returned");
      setLoading(false);
      return;
    }

    pollStatus(id);
  };

  const pollStatus = async (id) => {
    const res = await fetch(`/api/status?id=${id}`);
    const data = await res.json();

    if (data.status === "done") {
      setImageUrl(data.imageUrl);
      setLoading(false);
    } else if (data.status === "processing") {
      setTimeout(() => pollStatus(id), 2000);
    } else {
      console.error("Generation failed");
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>🤖 Generate Robo Avatar</h1>
      <input
        type="text"
        placeholder="Enter your prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />
      <button onClick={generateImage} style={{ marginLeft: "10px", padding: "10px 20px" }}>
        Generate
      </button>

      {loading && <p>Loading...</p>}

      {imageUrl && (
        <div style={{ marginTop: "20px" }}>
          <img src={imageUrl} alt="Generated Robo" style={{ maxWidth: "300px" }} />
        </div>
      )}
    </div>
  );
}

export default App;
