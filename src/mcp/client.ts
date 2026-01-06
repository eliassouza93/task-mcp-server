import { Client } from "@modelcontextprotocol/sdk/client";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function main() {
  const client = new Client({
    name: "task-client",
    version: "1.0.0",
  });

  await client.connect(
    new StdioClientTransport({
      command: "npx",
      args: ["tsx", "src/mcp/server.ts"],
    })
  );

  const result = await client.callTool({
    name: "list_tasks",
    arguments: {},
  });

  console.log(result);
}

main();
