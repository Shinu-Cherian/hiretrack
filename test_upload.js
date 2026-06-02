const fs = require('fs');

async function test() {
  const formData = new FormData();
  // Create a dummy file blob
  const blob = new Blob(["hello world"], { type: "text/plain" });
  formData.append("attached_file", blob, "test.txt");
  formData.append("title", "null");
  formData.append("content", "null");

  try {
    const res = await fetch("http://localhost:8000/api/notes/update/1/", {
      method: "POST",
      body: formData,
      // No credentials needed since we're just hitting it to see the raw error (auth_error will trigger)
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

test();
