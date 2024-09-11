'use client';
import React, { useState, Suspense } from 'react';
import NodeEditor from './components/NodeEditor';
import dynamic from 'next/dynamic';

const ChatComponent = dynamic(() => import('./components/ChatComponent'), {
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  const [graphJson, setGraphJson] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  const handleGraphUpdate = (json: string) => {
    setGraphJson(json);
  };

  const handleChatResponse = (response: string) => {
    setChatResponse(response);
  };

  return (
    <main className="flex min-h-screen">
      <div className="flex-grow border-r-2 border-gray-300">
        <NodeEditor onGraphUpdate={handleGraphUpdate} chatResponse={chatResponse} />
      </div>
      <div className="w-[400px]">
        <ChatComponent graphJson={graphJson} onChatResponse={handleChatResponse} />
      </div>
    </main>
  );
}
