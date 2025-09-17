import React, { useState } from "react";
import API from "../utils/api";
import { Button } from "./ui/button";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a resume");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const { data } = await API.post("/alumni/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (data.success) {
        setParsedData(data.parsed);
      } else {
        alert("Failed to parse resume");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading resume");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data } = await API.post("/alumni/save-resume", { parsed: parsedData });
      if (data.success) {
        alert("Resume details saved to profile ✅");
      } else {
        alert("Failed to save details ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving to profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Upload Resume</h3>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border rounded-lg p-2"
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Parsing..." : "Upload & Parse"}
        </Button>
      </form>

      {parsedData && (
        <div className="mt-6 space-y-3">
          <h4 className="text-md font-semibold">Extracted Details:</h4>
          <div className="bg-gray-50 border rounded-lg p-4">
            {Object.entries(parsedData).map(([key, value]) => (
              <p key={key}>
                <b>{key}:</b>{" "}
                {Array.isArray(value) ? value.join(", ") : value?.toString()}
              </p>
            ))}
          </div>
           <Button
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={saving}
          >{saving ? "Saving..." : "Save to Profile"}</Button>
        </div>
      )}
    </div>
  );
}
