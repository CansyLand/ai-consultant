import { ClassicPreset, NodeEditor } from 'rete';
import { Schemes } from '../components/editorSetup';

const socket = new ClassicPreset.Socket('default');

export interface NodeCommand {
  execute(editor: NodeEditor<Schemes>): void;
}

export class AddNodeCommand implements NodeCommand {
  constructor(private nodeData: { title: string, x: number, y: number }) {}
  
  execute(editor: NodeEditor<Schemes>) {
    const node = new ClassicPreset.Node(this.nodeData.title);
    node.addControl('title', new ClassicPreset.InputControl('text', { initial: this.nodeData.title }));
    node.addOutput("out", new ClassicPreset.Output(socket));
    node.addInput("in", new ClassicPreset.Input(socket));
    
    editor.addNode(node);
    
    const { x, y } = this.nodeData;
    const addedNode = editor.getNode(node.id);
    if (addedNode) {
      //addedNode.position = [x, y];
    }
  }
}

export class RemoveNodeCommand implements NodeCommand {
  constructor(private nodeId: string) {}
  
  execute(editor: NodeEditor<Schemes>) {
    editor.removeNode(this.nodeId);
  }
}

// Add more command classes as needed