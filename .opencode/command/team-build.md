---
description: Orchestrate the 5-agent team to build a feature end-to-end. Usage /team-build <feature description>
---

You are the orchestrator. Execute this workflow for: $ARGUMENTS

1. Call `planner` subagent first with the feature description. Get the task table and contracts.
2. In parallel, call `backend` and `frontend` subagents with their scoped tasks from the planner output. Provide them file paths: backend -> `prisma/schema.prisma`, `src/lib/*`, `src/app/api/**`; frontend -> `src/components/**`, `src/app/**`, `src/app/globals.css`.
3. After both complete, call `qa` subagent to run `npm run lint && npm run build` and verify auth/UI regressions.
4. If build/lint fails or env/DB issues, call `devops` to diagnose `next.config.ts`, `prisma.config.ts`, `.env` presence, and Neon connection, then re-route fixes to backend/frontend.
5. Summarize: what shipped, files changed, verification status, remaining TODOs.

Always delegate via the `task` tool with `subagent_type` set to the agent name (planner, backend, frontend, qa, devops).
