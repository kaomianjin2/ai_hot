# Architecture Rules

## 架构边界

- 第一版目标是单机可运行、可验证、可扩展来源的最小完整产品。
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
