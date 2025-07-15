import React, { useEffect, useState } from "react";
import axios from "../utils/api.jsx";

const ListNotes = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("/api/v1/realtime/notes");
        console.log("Fetched notes:", response.data);
        setNotes(response.data); // Save notes into state
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="flex flex-col items-center mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">List of Notes</h1>
      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-7xl">
          {notes.map((note) => (
            <div
              key={note._id}
              className="aspect-square border p-4 rounded-lg shadow-sm bg-white flex flex-col"
            >
              <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                {note.title}
              </h2>
              <span className="text-xs text-gray-500 block mb-2">
                {new Date(note.updatedAt).toLocaleDateString()}
              </span>
              <p className="text-sm text-gray-700 overflow-hidden text-ellipsis">
                {note._id}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListNotes;
