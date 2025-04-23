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
