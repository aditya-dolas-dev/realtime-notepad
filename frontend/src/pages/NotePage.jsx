import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  Wifi,
  WifiOff,
  Users,
  Send,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  MessageCircle,
  List,
} from "lucide-react";
import ListNotes from "./ListNotes";
import axios from "../utils/api.jsx";

const NotePage = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [noteId, setNoteId] = useState("");
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io("https://real-time-notepad-7a5c.onrender.com");
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on("connect", () => {
      setIsConnected(true);
      addMessage(`✅ Connected to server (ID: ${newSocket.id})`, "success");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      addMessage("❌ Disconnected from server", "error");
    });

    newSocket.on("connect_error", (error) => {
      addMessage(`❌ Connection error: ${error.message}`, "error");
    });

    // Note content handlers
    newSocket.on("note-content", (data) => {
      addMessage(`📋 Received note content: "${data.title}"`, "success");
      setTitle(data.title || "");
      setContent(data.content || "");
    });

    newSocket.on("content-updated", (data) => {
      addMessage(
        `🔄 Content updated by another user: "${data.title}"`,
        "success"
      );
      setTitle(data.title || "");
      setContent(data.content || "");
    });

    newSocket.on("error", (data) => {
      addMessage(`❌ Error: ${data.message}`, "error");
    });

    // Initial message
    addMessage("Page loaded, connecting to server...");

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message, type = "") => {
    const newMessage = {
      id: Date.now(),
      text: message,
      type: type,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const joinNote = () => {
    if (!noteId.trim()) {
      addMessage("❌ Please enter a note ID", "error");
      return;
    }

    if (!socket) {
      addMessage("❌ Not connected to server", "error");
      return;
    }

    setCurrentNoteId(noteId);
    socket.emit("join-note", noteId);
    addMessage(`🔗 Joining note room: ${noteId}`);
  };

  const updateRoom = () => {
    if (!currentNoteId) {
      addMessage("❌ Please join a note room first", "error");
      return;
    }

    if (!socket) {
      addMessage("❌ Not connected to server", "error");
      return;
    }

    socket.emit("update-room", {
      noteId: currentNoteId,
      title: title,
      content: content,
    });
    addMessage(`📤 Sent update to room: ${currentNoteId}`);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const copyNoteId = () => {
    navigator.clipboard.writeText(noteId);
    addMessage("📋 Note ID copied to clipboard", "success");
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={16} className="text-green-500" />;
      case "error":
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <MessageCircle size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Real-time Notepad</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <>
                    <Wifi size={20} className="text-green-300" />
                    <span className="text-green-300 font-medium">
                      Connected
                    </span>
                  </>
                ) : (
                  <>
                    <WifiOff size={20} className="text-red-300" />
                    <span className="text-red-300 font-medium">
                      Disconnected
                    </span>
                  </>
                )}
              </div>
              {currentNoteId && (
                <div className="flex items-center space-x-2">
                  <Users size={20} className="text-blue-300" />
                  <span className="text-blue-300">Room: {currentNoteId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Connection Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users className="mr-2" size={20} />
                Connect to Note Room
              </h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={noteId}
                  onChange={(e) => setNoteId(e.target.value)}
                  placeholder="Enter Note ID"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={copyNoteId}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center"
                  title="Copy Note ID"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={joinNote}
                  disabled={!isConnected}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Users size={16} />
                  <span>Join Room</span>
                </button>
              </div>
            </div>

            {/* Editor Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Edit Content</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Note Content"
                  rows={8}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
                <button
                  onClick={updateRoom}
                  disabled={!currentNoteId || !isConnected}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Send size={16} />
                  <span>Send Update</span>
                </button>
              </div>
            </div>

            {/* Messages Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <MessageCircle className="mr-2" size={20} />
                  Real-time Messages
                </h3>
                <button
                  onClick={clearMessages}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Trash2 size={16} />
                  <span>Clear</span>
                </button>
              </div>
              <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg bg-white p-4 space-y-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 p-2 rounded-lg border-l-4 ${
                      message.type === "success"
                        ? "border-green-500 bg-green-50"
                        : message.type === "error"
                        ? "border-red-500 bg-red-50"
                        : "border-blue-500 bg-blue-50"
                    }`}
                  >
                    {getMessageIcon(message.type)}
                    <div className="flex-1">
                      <span className="text-xs text-gray-500 font-medium">
                        {message.timestamp}:
                      </span>
                      <span className="ml-2 text-sm">{message.text}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle
                      size={48}
                      className="mx-auto mb-2 opacity-50"
                    />
                    <p>
                      No messages yet. Connect to a room to start collaborating!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ListNotes />
    </div>
  );
};

export default NotePage;
