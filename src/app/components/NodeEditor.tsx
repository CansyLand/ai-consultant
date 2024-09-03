'use client';

import React, { useEffect, useRef } from 'react';
import { createEditor } from './editorSetup';

const NodeEditor: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let destroy: (() => void) | undefined;

    if (containerRef.current) {
      createEditor(containerRef.current).then((editor) => {
        destroy = editor.destroy;
      });
    }

    return () => {
      destroy?.();
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />;
};

export default NodeEditor;