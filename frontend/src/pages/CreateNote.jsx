import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/api.jsx";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleCreate = async () => {
    try {
      const res = await axios.post("/api/v1/realtime/notes", { title });
      const noteId = res.data._id;
      navigate(`/note/${noteId}`);
    } catch (err) {
      console.error("Error creating note:", err);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold mb-4">Create a New Note</h1>
      <input
        type="text"
        placeholder="Enter title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-80 mb-4"
      />
      <button
        onClick={handleCreate}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
      >
        Create Note
      </button>
    </div>
  );
};

export default CreateNote;
