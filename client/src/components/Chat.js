import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Button } from "./ui/button";

const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:3000");

export default function Chat({ user, otherUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (user?._id && otherUser?._id) {
      socket.emit("joinRoom", { userId: user._id, otherId: otherUser._id });
    }

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [user, otherUser]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?._id || !otherUser?._id) return;
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api"}/chat/${user._id}/${otherUser._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
        });
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (e) {
        // ignore
      }
    };
    fetchHistory();
  }, [user, otherUser]);

  const sendMessage = () => {
    if (!text.trim()) return;
    if (!otherUser?._id) return;
    const msg = { sender: user._id, receiver: otherUser._id, text };
    socket.emit("sendMessage", msg);
    setText("");
  };

  return (
    <>
    

<div className="max-w-5xl mx-auto mt-8 bg-white rounded-2xl shadow-lg overflow-hidden flex h-[600px]">
  {/* Sidebar (just a placeholder, not using users) */}
  <div className="w-1/3 border-r bg-gray-100 p-4">
    <h3 className="text-lg font-bold mb-4">Chats</h3>
    <div className="space-y-2">
      <div className="p-3 bg-white rounded-xl shadow cursor-pointer">
        Default Chat
      </div>
    </div>
  </div>

  {/* Chat Section */}
  <div className="flex-1 flex flex-col">
    {/* Chat header */}
    <div className="p-4 border-b flex items-center justify-between">
      <h3 className="text-lg font-semibold">Chat</h3>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-scroll p-4 space-y-3">
      {messages.map((m, i) => (
        <div
          key={i}
          className={`p-2 rounded-xl max-w-xs ${
            (m.sender || m.senderId) === user._id
              ? "bg-blue-500 text-white ml-auto"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {m.text}
        </div>
      ))}
    </div>

    {/* Input */}
    <div className="p-3 border-t flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Button onClick={sendMessage}>Send</Button>
    </div>
  </div>
</div>    
</>
  );
}
