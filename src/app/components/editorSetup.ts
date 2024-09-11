import { createRoot } from "react-dom/client";
import { NodeEditor as ReteEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets,
} from "rete-connection-plugin";
import { ReactPlugin, Presets, ReactArea2D } from "rete-react-plugin";

type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = ReactArea2D<Schemes>;

export async function createEditor(container: HTMLElement) {
  console.log('Creating editor');

  const editor = new ReteEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl(),
  });

  render.addPreset(Presets.classic.setup());
  connection.addPreset(ConnectionPresets.classic.setup());

  editor.use(area);
  area.use(connection);
  area.use(render);

  AreaExtensions.simpleNodesOrder(area);

  const socket = new ClassicPreset.Socket("socket");

  const a = new ClassicPreset.Node("A");
  a.addControl("a", new ClassicPreset.InputControl("text", { initial: "a" }));
  a.addOutput("a", new ClassicPreset.Output(socket));
  await editor.addNode(a);

  const b = new ClassicPreset.Node("B");
  b.addControl("b", new ClassicPreset.InputControl("text", { initial: "b" }));
  b.addInput("b", new ClassicPreset.Input(socket));
  await editor.addNode(b);

  const c = new ClassicPreset.Node("C");
  c.addControl("c", new ClassicPreset.InputControl("text", { initial: "c" }));
  c.addOutput("c", new ClassicPreset.Output(socket));
  await editor.addNode(c);

  await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "b"));
  await editor.addConnection(new ClassicPreset.Connection(c, "c", b, "b"));

  // Adjust these values as needed
  await area.translate(a.id, { x: 50, y: 50 });
  await area.translate(b.id, { x: 320, y: 50 });
  await area.translate(c.id, { x: 50, y: 200 }); // Position C beneath A

  // Ensure the area is properly arranged
  AreaExtensions.zoomAt(area, editor.getNodes());

  console.log('Number of nodes:', editor.getNodes().length);

  return {
    editor,
    destroy: () => {
      // Cleanup logic here
    },
    zoomToFit: async () => {
      // Zoom logic here
    }
  };
}