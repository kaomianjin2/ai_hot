# Workflow Rules

## 队列文件

主 agent 负责维护队列，包括领取、状态迁移和完成记录。

| 文件 | 用途 |
|---|---|
| `docs/todo_plan.md` | 待开发任务 |
| `docs/doing_plan.md` | 进行中任务 |
| `docs/done_plan.md` | 已完成任务 |
| `docs/development-plan.md` | Feature Unit 存档（主 agent 根据 planner 输出维护） |

- `docs/development-plan.md` 仅在 planner 重审、范围重写或队列对账纠偏时由主 agent 修改
- 其它 subagent 一律只读

## 队列读取

- 每次开始任务前读取三份队列顶部 `Task Count`
- `docs/doing_plan.md` 有任务时，必须先核查滞留原因
- 未核查滞留任务前禁止领取新批次
- 默认只读取 `docs/todo_plan.md` 第一条；仅为确认同批次依赖和写入范围时，继续读取必要后续任务
- 非必要不读取 `docs/development-plan.md`

## 通道

任务领取时由主 agent 声明通道，写入 doing 记录的 `Channel` 字段。

- **Heavy**（默认）：`explorer → impl → reviewer → tester`
- **Light**：`impl → tester`
- tester PASS 即视为完成，主 agent 直接迁 done，不再设用户复核环节

### Light 触发条件（满足任一即可）

- Write Scope 仅 1 个文件
- 改动 <50 行（含新增）
- 仅类型定义、常量、文案、样式微调
- Feature Unit Scope 已写明具体文件且无未知调用链

### Heavy 触发条件（满足任一必走）

- Write Scope 跨 `client/**` 与 `server/**`
- 修改 API 契约、数据库 schema、共享入口文件
- 改动 ≥100 行
- UI 视觉改动（参见 `testing.md` 视觉改动判定）

### explorer 启用

仅在以下场景启用，否则由主 agent 自行探索：

- 任务 Scope 标注 Unknown 或调用链未知
- Heavy 通道任务的探索阶段
- 主 agent 明确点名 explorer

## 领取

- 任务不能凭空捏造、改名或跳号，只能从现有队列移动
- 一次最多领取 3 个任务
- 批量领取只允许领取 `Depends On` 已进入 `docs/done_plan.md` 的任务
- 同批任务的 Write Scope 必须精确到最终文件或目录，不能重叠到同一文件、同一共享入口
- 依赖同一未完成上游的任务禁止并行
- 领取后在 `./worktrees/<task-id>` 创建独立 git worktree

### 共享入口文件

任何修改必须独占领取，禁止与其他任务并行：

- 前端：`client/src/App.tsx`、`client/src/main.tsx`、`client/src/components/Topbar.tsx`、`client/vite.config.ts`、`client/tsconfig*.json`、`client/package.json`、`client/src/styles.css`
- 后端：`server/src/index.ts`、`server/src/app.ts`、`server/src/db/schema.ts`、`server/tsconfig.json`、`server/package.json`
- 根：`package.json`、`.gitignore`、`CLAUDE.md`、`.claude/rules/*`、`.claude/agents/*`
- 通用规则：被 ≥2 个 Feature Unit 在 Scope 中引用的文件，自动按共享入口处理

## 完成

- doing 任务 `State` 允许值：`In Progress`、`Blocked`、`Done Pending`、`Withdrawn`
- 验证失败的任务保留在 doing，状态标记为 `Blocked`
- tester PASS（退出码 0 且输出符合验收）后，主 agent 直接迁 `docs/done_plan.md`
- 完成记录字段不再包含 `User Review`、`User Review Source`
- `todo + doing + done` 任务总数必须保持不变
- 队列移动（状态迁移、写入 done）只能由主 agent 操作，禁止 subagent 操作

### 完成顺序

- 单任务：worktree 合并到主分支 → 移动计划状态、写入 done → 删除 worktree、执行 `git worktree prune`
- 同批次任务全部完成后，主 agent 统一 push 到远端，使用一条总结性提交说明，避免历史碎片化

## 撤回

- 探索后发现需求不可行、被其它任务覆盖或重复时，主 agent 可将任务标记 `Withdrawn`
- Withdrawn 任务从 doing 移回 todo 末尾并附 `State: Withdrawn` 与撤回原因
- Withdrawn 不计入 done，但守恒不变量仍要求 `todo + doing + done` 总数不变

## 工作流触发

- 队列读取、领取、完成、对账 → 遵循本文件队列规则
- 代码修改、排障、Feature Unit 实现 → 遵循 `.claude/rules/coding.md`
- 架构边界、API 契约、跨模块、Write Scope 分配 → 遵循 `.claude/rules/architecture.md`
- 成功标准、验证执行、验证失败、交付验证 → 遵循 `.claude/rules/testing.md`
- Subagent skill 使用边界 → 遵循 `.claude/rules/skills.md`

## Subagent 调度

| 角色 | Agent | 模型 | 权限 | 职责 |
|---|---|---|---|---|
| 规划 | `planner` | opus | 只读 | 任务拆解与规划 |
| UI 设计 | `ui-designer` | sonnet | 读写 | UI 方案，输出到 `design/**` |
| 前端实现 | `frontend` | sonnet | 读写 | 前端开发 `client/**` |
| 后端实现 | `backend` | sonnet | 读写 | 后端开发 `server/**` |
| 探索 | `explorer` | sonnet | 只读 | 代码探索与证据收集（按需启用） |
| 集成 | `integrator` | sonnet | 读写 | API 契约、跨端集成 |
| 综合审查 | `reviewer` | sonnet | 只读 | 规格符合度 + 代码质量审查 |
| 测试 | `tester` | haiku | 只读+Bash | 构建、测试、Playwright 验证 |
