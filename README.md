## Principais Funcionalidades

O MCP Server expõe as seguintes ferramentas para interação com o domínio de tarefas:

- **list_tasks**  
  Lista todas as tarefas registradas no sistema.

- **get_task_by_id**  
  Recupera uma tarefa específica por identificador.

- **task_summary**  
  Retorna métricas agregadas (total, concluídas e pendentes).

- **create_task**  
  Cria uma nova tarefa no sistema.

- **updated_task**  
  Atualiza atributos de uma tarefa existente.

- **delete_task**  
  Remove uma tarefa de forma definitiva.

Cada ferramenta possui:
- Validação de entrada com **Zod**
- Tratamento explícito de erros (`try/catch`)
- Retorno estruturado e interpretável por LLMs

---

## Estrutura do Projeto

-npm install
-npm run dev
