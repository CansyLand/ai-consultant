import NodeEditor from './components/NodeEditor';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ChatComponent = dynamic(() => import('./components/ChatComponent'), {
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <div className="flex-grow border-r-2 border-gray-300">
        <NodeEditor />
      </div>
      <Suspense fallback={<div className="w-[400px] h-screen p-4">Loading...</div>}>
        <div className="w-[400px] h-screen border-l-2 border-gray-300 p-4">
          <ChatComponent />
        </div>
      </Suspense>
    </main>
  );
}
