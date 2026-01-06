import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { z } from "zod";

type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
};

async function main() {
  const server = new McpServer({
    name: "task-mcp",
    version: "1.0.0",
  });
  // tool de listar tarefas
  server.tool("list_tasks", "lista todas as tarefas", {}, async () => {
    const res = await fetch("http://localhost:3000/");
    const tasks = await res.json();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(tasks, null, 2),
        },
      ],
    };
  });
  //aqui chama a api com fetch
  server.tool(
    "get_task_by_id",
    "busca uma tarefa pelo ID",
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
  //busca e retorna um resumo das tarefas concluidas ou pendentes
  server.tool(
    "task_summary",
    "retorna um resumo das tarefas (total, concluídas e pendentes)",
    {},
    async () => {
      try {
        const res = await fetch("http://localhost:3000/");
        const tasks = (await res.json()) as Task[];

        const total = tasks.length;
        const completed = tasks.filter((t: any) => t.completed).length;
        const pending = total - completed;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total,
                  completed,
                  pending,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `erro ao gerar resumo: ${error.message}`,
            },
          ],
        };
      }
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
main();
