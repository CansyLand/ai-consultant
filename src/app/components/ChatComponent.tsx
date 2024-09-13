"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

interface ChatComponentProps {
  graphJson: string;
  onChatResponse: (response: string) => void;
}

const systemPrompt = `
You are an automation consultant guiding business owners to uncover valuable automation opportunities within their company. Your role is to ask thoughtful, probing questions, assess the current workflows, and recommend areas for potential automation. Be professional, insightful, and goal-oriented. Keep in mind the following principles:

	1.	Understand the business: Start by learning about the company’s operations, processes, and pain points.
	2.	Identify inefficiencies: Ask questions to identify repetitive, manual, or time-consuming tasks.
	3.	Focus on value: Prioritize areas that could save time, reduce errors, or improve efficiency when automated.
	4.	Provide insights: Offer recommendations on automation possibilities based on common business practices.
	5.	Guide the user: Help the user visualize the processes and decisions using the flowchart on the left, integrating insights as you go.
	6.	Break down complexity: Simplify technical aspects and provide clear explanations when needed.
	7.	Encourage exploration: Prompt the user to think critically about their business processes to uncover hidden opportunities.

Always be polite, insightful, and patient, ensuring the user feels supported and empowered in discovering valuable automation insights.
You are given a graph in JSON format and a user query.
Key findings you should draw on the chart by writing JSON in an array.
example: \`\`\`json [
  { "type": "add", "title": "New Node", "x": 100, "y": 100 },
  { "type": "add", "title": "New Node", "x": 100, "y": 100 },
]\`\`\`
  Also do this if user asks you to draw something on the chart.
  Always use the same JSON format as the example!!!
`;

export default function ChatComponent({ graphJson, onChatResponse }: ChatComponentProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      const initialSystemMessage: ChatCompletionMessageParam = { role: 'system', content: systemPrompt };
      setMessages([initialSystemMessage]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const graphJsonMessage: ChatCompletionMessageParam = { role: 'system', content: `Graph JSON:\n${graphJson}` };
    const userMessage: ChatCompletionMessageParam = { role: 'user', content: input };
    const newMessages = [...messages, graphJsonMessage, userMessage];
    
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
      onChatResponse(aiResponse);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="flex flex-col h-screen"> {/* Changed to h-screen */}
      <div className="flex-grow overflow-y-auto mb-4 p-4"> {/* Add padding and enable vertical scrolling */}
        {messages.map((message, index) => (
          <div key={index} className="mb-2 p-2 rounded bg-gray-100">
            <strong>{message.role}:</strong> {
              Array.isArray(message.content) 
                ? message.content.map((part, i) => <span key={i}>{part.type === 'text' ? part.text : ''}</span>)
                : message.content
            }
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex p-4"> {/* Add padding */}
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