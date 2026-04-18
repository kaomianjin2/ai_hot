# AI Hot Radar Agent Index

本文件是项目入口索引，不是手册。规则细节、subagent 配置、编码规范、架构规范、验证规范统一按需加载 `.codex/`。

## 项目目标

- 构建 AI 热点雷达：前端展示热点、监控词、搜索与扫描；后端提供采集、评分、存储和通知能力。
- 优先级：真实验证 > 架构边界 > 小范围改动 > 文档一致性。
- Feature Unit 完成条件：真实验证通过，并写入队列结果；禁止伪造验证通过。

## 强制约束

- 始终使用简体中文。
- Shell 命令必须使用 `rtk` 前缀。
- 用户当前指令优先。
- 修改代码、排障、多步骤任务必须先给计划。
- 计划格式：`1. [操作] → verify: [验证方式]`。
- 未经允许禁止：安装 / 升级依赖、修改 `.env` / `.gitignore` / 密钥 / 证书 / 生产配置、修改数据库结构 / 接口定义 / 部署流程、删除文件、大规模重构。
- `docs/` 只维护开发计划存档和计划队列；规则和配置只维护在 `.codex/`。

## 进入项目只读

1. 读取 `AGENTS.md`。
2. 读取 `docs/doing_plan.md` 顶部 `Task Count` 和滞留任务。
3. 读取 `docs/todo_plan.md` 顶部 `Task Count` 和第一条任务。
4. 读取 `docs/done_plan.md` 顶部 `Task Count`。

非必要不读取 `docs/development-plan.md`。只有队列总数不一致、计划审查、计划矫正时，才读取它核查。

## 状态协议

- `doing_plan.md` 有滞留任务时，先核查解决，不得直接领取新任务。
- 领取任务：从 `docs/todo_plan.md` 按序移动到 `docs/doing_plan.md`，批量领取一次最多 3 个。
- 完成任务：真实验证通过后，从 `docs/doing_plan.md` 移动到 `docs/done_plan.md`。
- 三份队列顶部 `Task Count` 必须唯一、准确。
- `todo + doing + done` 总数必须等于 `docs/development-plan.md` 的 Feature Unit 总数。
- 任务不能凭空新增；`docs/todo_plan.md` 来源必须是 `docs/development-plan.md`。
- 禁止读取或恢复已清除的旧进度文件和旧 UI 计划文件。

## 强制工作流触发器

- 影响 API 契约：加载 `.codex/rules/arch.md`，核对 `docs/development-plan.md` 的 API Index。
- 影响数据库写入、schema、迁移：加载 `.codex/rules/arch.md` 和 `.codex/rules/testing.md`。
- 影响并发、批次、subagent 并行：加载 `.codex/rules/queue.md` 和 `.codex/rules/arch.md`。
- 跨越 `client/` 与 `server/`：加载 `.codex/rules/arch.md`，明确 `Write Scope`。
- 修改代码：加载 `.codex/rules/coding.md`。
- 验证、交付、移动到 done：加载 `.codex/rules/testing.md`。
- 任务跨度超过 1 个模块：先写短计划，再执行。

## 知识地图

- 队列协议：`.codex/rules/queue.md`
- 编码规则：`.codex/rules/coding.md`
- 架构规则：`.codex/rules/arch.md`
- 验证规则：`.codex/rules/testing.md`
- Subagent 注册：`.codex/config.toml`
- Subagent 定义：`.codex/agents/*.toml`
- 当前任务：`docs/doing_plan.md`
- 待做任务：`docs/todo_plan.md`
- 已完成任务：`docs/done_plan.md`
- 开发计划存档：`docs/development-plan.md`
- UI 参考：`design/ai-hot-radar.html`

## 技术栈

- Frontend：React + Vite + TypeScript + CSS
- Backend：Node.js + Fastify + TypeScript
- Storage：SQLite
- QA：Build + API curl + Playwright

## 按需加载

- 不得默认全量读取 `.codex/rules/*` 或 `.codex/agents/*`。
- 只加载当前任务触发的规则和 subagent 配置。
- Subagent 职责、模型、sandbox、可用 skill 只在 `.codex/agents/*.toml` 中维护。
- `AGENTS.md` 不写 subagent 细节。

## 交付要求

- 最终回复必须包含：改动内容、验证命令、验证结果、退出码。
- 必须说明副作用和已有调用方影响。
- 验证失败时不得标记完成；保留阻塞原因和真实输出。
