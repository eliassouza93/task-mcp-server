import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { z } from "zod";

async function main() {
  const server = new McpServer({
    name: "task-mcp",
    version: "1.0.0",
  });
  // tool de listar tarefas
  server.tool("list_tasks", "lista todas as tarefas", {}, async () => {
    return {
      content: [
        {
          type: "text",
          text: "aqui futuramente virão as tarefas do banco",
        },
      ],
    };
  });
  //aqui chama a api com fetch
  server.tool(
    "get_task_by_id",
    "Busca uma tarefa pelo ID",
    {
      id: z.string().describe("UUID da tarefa"),
    },
    async ({ id }) => {
      const res = await fetch(`http://localhost:3000/task/${id}`);
      const task = await res.json();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(task, null, 2),
          },
        ],
      };
    }
  );

  // transport (stdio é o mais comum usado)
  // esse modelo de exportação aqui é para TYPE MODULE
  //const transport = new StdioServerTransport();
  //await server.connect(transport);
}
main();
