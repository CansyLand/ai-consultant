"use client";

import React, { useState } from 'react';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface ChatComponentProps {
  graphJson: string;
  onChatResponse: (response: string) => void;
}

export default function ChatComponent({ graphJson, onChatResponse }: ChatComponentProps) {
  console.log(graphJson);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const systemMessage: ChatCompletionMessageParam = { role: 'system', content: graphJson };
    const userMessage: ChatCompletionMessageParam = { role: 'user', content: input };
    const newMessages = [...messages, systemMessage, userMessage];
    
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      const aiResponse = data.result.content;
      setMessages([...newMessages, data.result]);
      onChatResponse(aiResponse); // Call this to update the parent state
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div key={index} className="mb-2 p-2 rounded bg-gray-100">
            <strong>{message.role}:</strong> {
              Array.isArray(message.content) 
                ? message.content.map((part, i) => <span key={i}>{part.type === 'text' ? part.text : ''}</span>)
                : message.content
            }
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow border rounded-l p-2"
          placeholder="Type your message..."
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}