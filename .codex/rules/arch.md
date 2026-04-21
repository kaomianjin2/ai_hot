# Architecture Rules

## 职责

- 本文件只定义项目架构边界、技术约束、subagent Flow、并发原则和 agent 写入边界。
- 本文件不定义队列状态迁移、验证命令、验证证据格式、编码风格。

## 项目目标

- 构建 AI 热点雷达：前端展示热点、监控词、搜索与扫描；后端提供采集、评分、存储和通知能力。
- 第一版目标是单机可运行、可验证、可扩展来源的最小完整产品。

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
- API 契约变更必须同步前后端类型与调用约定。
- 多 agent 并行必须满足依赖已满足、写入范围不重叠、Owner 唯一。

## Flow

- `planning_flow`：只在项目立项、计划重写、范围重审时运行 `planner`。
- `ui_design_flow`：只在 UI 规格缺失、设计变更、视觉验收前运行 `ui_designer`。
- `batch_flow`：固定为 `explorer -> implementation_agent -> spec_reviewer -> code_reviewer -> tester`。
- `batch_flow` 覆盖 Feature Unit 执行、bug 修复、任意业务代码改动和业务操作。
- `implementation_agent` 只能由主 Agent 按 Write Scope 分配。
- 仅 `client/**` 使用 `frontend`。
- 仅 `server/**` 使用 `backend`。
- 跨 `client/**` 与 `server/**`、API 契约、端到端链路使用 `integrator`。
- `user_review_gate`：tester PASS 后，主 Agent 请求用户复核。
- `release_gate`：用户复核 PASS 后运行 `release` 做交付收口；用户复核 PASS 前禁止 release。

## 并发原则

- 依赖未满足的任务禁止并行。
- Write Scope 重叠的任务禁止并行。
- 涉及同一共享入口文件的任务串行执行。
- `integrator` 不与 `frontend` 或 `backend` 并行修改同一文件。

## 技术栈

- Frontend：React + Vite + TypeScript + CSS
- Backend：Node.js + Fastify + TypeScript
- Storage：SQLite