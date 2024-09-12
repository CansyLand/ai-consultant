This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

:)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


https://platform.openai.com/docs/quickstart?language-preference=javascript
https://retejs.org/docs/api/rete

## AI-Driven Node Graph Generation

This project implements an AI-driven node graph generation system using the Command pattern and Rete.js. Here's an overview of the flow:

1. **AI Chat Interaction**: Users interact with an AI chat interface to describe desired changes to the node graph.

2. **Command Generation**: The AI generates a JSON response containing commands (e.g., add or remove nodes).

3. **Command Parsing**: The `parseAIResponse` function in `nodeCommandParser.ts` parses the AI's JSON response into `NodeCommand` objects.

4. **Command Pattern**: We use the Command pattern to encapsulate node operations:
   - `NodeCommand` interface defines the structure for commands.
   - `AddNodeCommand` and `RemoveNodeCommand` implement specific node operations.

5. **Command Execution**: The parsed commands are executed on the Rete.js node editor, updating the graph.

6. **Undo/Redo Functionality**: The Command pattern allows for easy implementation of undo/redo operations.

This architecture provides a flexible and extensible way to manage AI-driven changes to the node graph, with the potential for advanced features like operation history and batch processing.


LLM Response:
```json
[
  { "type": "add", "title": "New Node", "x": 100, "y": 100 },
  { "type": "remove", "id": "node123" }
]
```