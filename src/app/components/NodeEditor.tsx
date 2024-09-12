'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createEditor } from './editorSetup';
import { NodeEditor as ReteEditor, GetSchemes, ClassicPreset } from 'rete';
import { parseAIResponse } from '../utils/nodeCommandParser';

const socket = new ClassicPreset.Socket('default');

type Schemes = GetSchemes<ClassicPreset.Node, ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>>;

export interface NodeEditorProps {
  onGraphUpdate: (json: string) => void;
  chatResponse: string; // Add this prop
}

const NodeEditor: React.FC<NodeEditorProps> = ({ onGraphUpdate, chatResponse }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ReteEditor<Schemes> | null>(null);
  const initializationRef = useRef(false);
  const [lastProcessedResponse, setLastProcessedResponse] = useState('');

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (containerRef.current && !editorRef.current && !initializationRef.current) {
      initializationRef.current = true;
      console.log('Initializing editor');
      createEditor(containerRef.current).then(({ editor, destroy }) => {
        editorRef.current = editor;
        cleanup = destroy;

        // Add event listener for graph changes
        editor.addPipe(context => {
          //if (['nodecreated', 'noderemoved', 'connectioncreated', 'connectionremoved'].includes(context.type)) {
            console.log(`Graph changed: ${context.type}`);
            exportAndLogNodes();
          //}
          return context;
        });
      });
    }

    return () => {
      cleanup?.();
      editorRef.current = null;
    };
  }, []);

  const addNodeIfMentioned = useCallback((response: string) => {
    console.log('addNodeIfMentioned called with:', response);
    if (response.toLowerCase().includes('node') && editorRef.current) {
      // Node is created here
      const newNode = new ClassicPreset.Node('New Node Title');
      newNode.addControl('title', new ClassicPreset.InputControl('text', { initial: 'New Nodeeee' }));
      newNode.addOutput("a", new ClassicPreset.Output(socket));
      newNode.addInput("b", new ClassicPreset.Input(socket));
      
      editorRef.current.addNode(newNode);
      
      console.log('New node added based on chat response');
      exportAndLogNodes();
    }
  }, []);

  const exportAndLogNodes = useCallback(() => {
    if (editorRef.current) {
      const nodes = editorRef.current.getNodes();
      const connections = editorRef.current.getConnections();

      const exportedData = {
        nodes: nodes.map(node => ({
          id: node.id,
          label: node.label,
          inputs: Object.entries(node.inputs).map(([key, input]) => ({
            key,
            label: input?.label ?? '',
            socket: input?.socket?.name ?? '',
          })),
          outputs: Object.entries(node.outputs).map(([key, output]) => ({
            key,
            label: output?.label ?? '',
            socket: output?.socket?.name ?? '',
          })),
          controls: Object.entries(node.controls).map(([key, control]) => ({
            key,
            //label: (control as ClassicPreset.InputControl<"number" | "text">).,
            value: (control as ClassicPreset.InputControl<"number" | "text">).value,
          })),
        })),
        connections: connections.map(connection => ({
          id: connection.id,
          source: connection.source,
          sourceOutput: connection.sourceOutput,
          target: connection.target,
          targetInput: connection.targetInput,
        })),
      };

      console.log('Exported Graph:', JSON.stringify(exportedData, null, 2));
      onGraphUpdate(JSON.stringify(exportedData));
    }
  }, [onGraphUpdate]);

  useEffect(() => {
    console.log('chatResponse changed:', chatResponse);
    if (chatResponse && chatResponse !== lastProcessedResponse && editorRef.current) {
      const commands = parseAIResponse(chatResponse);
      
      commands.forEach(command => {
        command.execute(editorRef.current!);
      });
      
      exportAndLogNodes();
      setLastProcessedResponse(chatResponse);
    }
  }, [chatResponse, lastProcessedResponse, exportAndLogNodes]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
  );
};

export default NodeEditor;