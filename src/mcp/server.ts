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
  //lista tarefa por id
  server.tool(
    "get_task_by_id",
    "busca uma tarefa pelo ID",
    {
      id: z.string().describe("UUID da tarefa"),
    },
    async ({ id }) => {
      const res = await fetch(`http://localhost:3000/${id}`);
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
  // cria tarefa
  server.tool(
    "create_task",
    "cria uma nova tarefa",
    {
      title: z.string().min(1).describe("Titulo da tarefa"),
      description: z.string().optional().describe("Descrição da tarefa"),
    },
    async ({ title, description }) => {
      try {
        const res = await fetch("http://localhost:3000/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description }),
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        const task = await res.json();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(task, null, 2),
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            { type: "text", text: `erro ao criar tarefa: ${error.message}` },
          ],
        };
      }
    }
  );
  //editar uma tarefa
  server.tool(
    "updated_task",
    "editar tarefa",
    {
      id: z.string().describe("UUID da tarefa a ser editada"),
      title: z.string().optional().describe("novo titulo da tarefa"),
      description: z.string().optional().describe("nova descrição da tarefa"),
      completed: z.boolean().optional().describe("status da tarefa"),
    },
    async ({ id, title, description, completed }) => {
      try {
        const res = await fetch(`http://localhost:3000/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            completed,
          }),
        });
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || `erro HTTP ${res.status}`);
        }

        const updatedTask = await res.json();

        return {
          content: [
            { type: "text", text: JSON.stringify(updatedTask, null, 2) },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `erro ao editar tarefa: ${error.message}`,
            },
          ],
        };
      }
    }
  );

  //deletar tarefa
  server.tool(
    "delete_task",
    "remover tarefa",
    {
      id: z.string().describe("UUID da tarefa a ser removida"),
    },
    async ({ id }) => {
      try {
        const res = await fetch(`http://localhost:3000/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const errorTxt = await res.text();
          throw new Error(errorTxt || `erro HTTP ${res.status}`);
        }
        return {
          content: [
            {
              type: "text",
              text: `tarefa ${id} removida com sucesso!`,
            },
          ],
        };
      } catch (error: any) {
        return {
          content: [
            {
              type: "text",
              text: `erro ao tentar deletar tarefa ${error.message}`,
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
