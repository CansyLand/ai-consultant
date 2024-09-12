import { NodeCommand, AddNodeCommand, RemoveNodeCommand } from './nodeCommands';

export function parseAIResponse(response: string): NodeCommand[] {
  try {
    // Extract JSON from the response
    const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      throw new Error('No JSON found in the response');
    }
    const jsonString = jsonMatch[1];
    
    const commandsData = JSON.parse(jsonString) as Array<{type: string, [key: string]: any}>;
    
    return commandsData.map<NodeCommand | null>(cmd => {
      switch (cmd.type) {
        case 'add':
          return new AddNodeCommand({ title: cmd.title, x: cmd.x ?? 100, y: cmd.y ?? 100 });
        case 'remove':
          return new RemoveNodeCommand(cmd.id);
        default:
          console.warn(`Unknown command type: ${cmd.type}`);
          return null;
      }
    }).filter((cmd): cmd is NodeCommand => cmd !== null);
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return [];
  }
}