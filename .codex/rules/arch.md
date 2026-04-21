# Architecture Rules

## 项目目标

- 构建 AI 热点雷达：前端展示热点、监控词、搜索与扫描；后端提供采集、评分、存储和通知能力。
- 第一版目标是单机可运行、可验证、可扩展来源的最小完整产品。
- Feature Unit 完成条件：真实验证通过，并写入队列结果；禁止伪造验证通过。

## 架构边界

- 前端只写 `client/**`。
- 后端只写 `server/**`。
- 集成任务跨 `client/**` 和 `server/**` 前，必须由主 Agent 明确 `Write Scope`。
- Subagent 禁止维护队列文件。

## 数据流

```text
User
  |
  v
React UI
  |
  v
Fastify API
  |
  v
SQLite
  ^
  |
Sources: Mock -> RSS -> GitHub
```

## 约束

- 不引入 UI 组件库、图标库、Figma。
- 第一版不做登录、多用户、Docker、Redis、消息队列、PostgreSQL、WebSocket 实时推送。
- API 契约变更必须同步前后端类型和验证。
- 多 agent 并行必须满足依赖已满足、写入范围不重叠、Owner 唯一。

## Flow

- `planning_flow`：只在项目立项、计划重写、范围重审时运行 `planner`。
- `ui_design_flow`：只在 UI 规格缺失、设计变更、视觉验收前运行 `ui_designer`。
- 业务操作必须 subagent 驱动；主 Agent 只负责加载规则、拆分范围、调度 Flow、维护队列和请求用户复核。
- `batch_flow`：日常 Feature Unit 执行固定为 `explorer -> implementation -> spec_reviewer -> code_reviewer -> tester`。
- `batch_flow` 覆盖 Feature Unit 执行、bug 修复、任意代码改动和业务操作；紧急小修也必须至少经过对应 `implementation_agents -> code_reviewer -> tester`。
- `implementation_agents`：按任务 Owner 选择 `frontend`、`backend` 或 `integrator` 中的一个或多个；同一文件只能由一个 agent 修改。
- `user_review_gate`：tester 真实验证 PASS 后，主 Agent 立即请求用户复核；用户复核 PASS 前禁止 release、移动计划状态、合并或清理 worktree。
- `release_gate`：tester 真实验证 PASS 且用户复核 PASS 后运行 `release` 做交付收口。
- 前端页面设计或视觉改动必须通过 Playwright 进入真实浏览器验证；验证失败时，主 Agent 调度对应实现 subagent 修复后重新进入 tester。

## 并发 Lane

- Lane A：frontend 串行推进 `F0101 -> F0102 -> F0103 -> F0104-F0106 -> F0107-F0109`，涉及 `client/src/App.tsx` 的任务串行执行。
- Lane B：backend 串行推进 `F0201 -> F0202 -> F0203 -> F0204-F0206`，涉及同一 route、service 或 db 文件的任务串行执行。
- Lane C：integrator 在 Lane A 和 Lane B 对应依赖验证通过后执行 `F0207`。
- Lane D：sources/scoring 按 `F0301 -> F0302/F0303 -> F0304 -> F0305` 执行；`F0302` 和 `F0303` 只有在 `F0301` 完成且写入文件独立时并行。
- Lane E：notification UI 在 `F0207` 和 `F0305` 验证通过后执行 `F0306`。
- `frontend`、`backend` 可并行；`integrator` 不与 `frontend` 或 `backend` 并行修改同一文件。

## 技术栈

- Frontend：React + Vite + TypeScript + CSS
- Backend：Node.js + Fastify + TypeScript
- Storage：SQLite
- QA：Build + API curl + Playwright

## 工作流触发器

- 执行 Feature Unit、修 bug、修改代码、处理业务操作：加载本文件，进入 `batch_flow`。
- 影响 API 契约：加载本文件，核对 `docs/development-plan.md` 的 API Index。
- 影响数据库写入、schema、迁移：加载本文件和 `.codex/rules/testing.md`。
- 影响并发、批次、subagent 并行：加载本文件和 `.codex/rules/queue.md`。
- 跨越 `client/` 与 `server/`：加载本文件，明确 `Write Scope`。
- 任务跨度超过 1 个模块：先写短计划，再执行。
