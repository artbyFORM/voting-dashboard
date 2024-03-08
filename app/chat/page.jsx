"use client";
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io('http://localhost:3001', { transports : ['websocket'] }); 

const Index = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Listen for incoming messages
    socket.on('vote message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  const sendMessage = () => {
    socket.emit('vote message', newMessage);
    setNewMessage('');
  };

  return (
    <div>
      <h1>Real-Time Vote Updates</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Index;