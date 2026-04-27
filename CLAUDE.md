# AI Hot Radar

AI 热点雷达 — 前端展示热点、监控词、搜索与扫描；后端采集、评分、存储和通知。

**技术栈**：React + Vite + TypeScript | Node.js + Fastify + TypeScript | SQLite

**数据流**：`User → React UI → Fastify API → SQLite ← Sources (Mock → RSS → GitHub)`

## 核心约束

- 前端 `client/**`，后端 `server/**`，跨端集成须先明确 Write Scope
- 第一版：无登录/多用户/Docker/Redis/消息队列/PostgreSQL/WebSocket
- 队列文件（`docs/todo_plan.md` / `docs/doing_plan.md` / `docs/done_plan.md`）由主 agent 维护

## 规则文件

| 文件 | 用途 |
|---|---|
| `.claude/rules/architecture.md` | 架构边界、技术约束、并发原则 |
| `.claude/rules/coding.md` | 编码规范、修改边界、禁止事项 |
| `.claude/rules/testing.md` | 测试标准、验证门禁、记录格式 |
| `.claude/rules/workflow.md` | 队列工作流、subagent 调度、worktree 管理 |

## Subagent

10 个自定义 agent，定义在 `.claude/agents/`：

| Agent | 模型 | 权限 | 职责 |
|---|---|---|---|
| planner | deepseek-v4-flash | 只读 | 任务拆解与规划 |
| ui-designer | deepseek-v4-pro | 读写 | UI 设计，输出到 `design/**` |
| frontend | deepseek-v4-pro | 读写 | 前端开发 `client/**` |
| backend | deepseek-v4-pro | 读写 | 后端开发 `server/**` |
| explorer | deepseek-v4-flash | 只读 | 代码探索与证据收集 |
| integrator | deepseek-v4-pro | 读写 | API 契约、跨端集成 |
| spec-reviewer | deepseek-v4-pro | 只读 | 规格符合度审查 |
| code-reviewer | deepseek-v4-pro | 只读 | 代码质量审查 |
| tester | deepseek-v4-flash | 读写 | 构建、测试、Playwright 验证 |
| release | deepseek-v4-pro | 只读 | 交付收口汇总 |

## Git Worktree

开发在 `./worktrees/<task-id>` 下进行，任务完成后清理。

## 队列文件

与 Codex 共用 `docs/todo_plan.md` / `docs/doing_plan.md` / `docs/done_plan.md`，`docs/development-plan.md` 仅在队列对账时读取。
