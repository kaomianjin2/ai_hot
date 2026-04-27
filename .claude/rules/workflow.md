# Workflow Rules

## 队列文件

主 agent 负责维护队列，包括领取、状态迁移和完成记录。

| 文件 | 用途 |
|---|---|
| `docs/todo_plan.md` | 待开发任务 |
| `docs/doing_plan.md` | 进行中任务 |
| `docs/done_plan.md` | 已完成任务 |
| `docs/development-plan.md` | Feature Unit 存档（仅队列对账时读取） |

## 队列读取

- 每次开始任务前读取三份队列顶部 `Task Count`
- `docs/doing_plan.md` 有任务时，必须先核查滞留原因
- 未核查滞留任务前禁止领取新批次
- 默认只读取 `docs/todo_plan.md` 第一条；仅为确认同批次依赖和写入范围时，继续读取必要后续任务
- 非必要不读取 `docs/development-plan.md`

## 领取

- 任务不能凭空捏造、改名或跳号，只能从现有队列移动
- 一次最多领取 3 个任务
- 批量领取只允许领取 `Depends On` 已进入 `docs/done_plan.md` 的任务
- 同批任务的 Write Scope 必须精确到最终文件或目录，不能重叠到同一文件、同一共享入口
- 共享入口文件默认串行：`client/src/App.tsx`、`client/src/components/Topbar.tsx` 等
- 依赖同一未完成上游的任务禁止并行
- 领取后在 `./worktrees/<task-id>` 创建独立 git worktree

## 完成

- 验证失败的任务保留在 doing，状态标记为 Blocked
- tester PASS 且用户复核 PASS 后，才能移动到 `docs/done_plan.md`
- `todo + doing + done` 任务总数必须保持不变
- 用户未明确复核通过前，禁止移动计划状态、写入 done
- worktree 合并到主分支，并且将任务push 之后才能移动计划状态、写入 done、删除 worktree，执行 `git worktree prune`

## 工作流触发

- 队列读取、领取、完成、对账 → 遵循本文件队列规则
- 代码修改、排障、Feature Unit 实现 → 遵循 `.claude/rules/coding.md`
- 架构边界、API 契约、跨模块、Write Scope 分配 → 遵循 `.claude/rules/architecture.md`
- 成功标准、验证执行、验证失败、交付验证 → 遵循 `.claude/rules/testing.md`

## Subagent 调度

| 角色 | Agent | 模型 | 权限 | 职责 |
|---|---|---|---|---|
| 规划 | `planner` | deepseek-v4-flash | 只读 | 任务拆解与规划 |
| UI 设计 | `ui-designer` | deepseek-v4-pro | 读写 | UI 方案，输出到 `design/**` |
| 前端实现 | `frontend` | deepseek-v4-pro | 读写 | 前端开发 `client/**` |
| 后端实现 | `backend` | deepseek-v4-pro | 读写 | 后端开发 `server/**` |
| 探索 | `explorer` | deepseek-v4-flash | 只读 | 代码探索与证据收集 |
| 集成 | `integrator` | deepseek-v4-pro | 读写 | API 契约、跨端集成 |
| 规格审查 | `spec-reviewer` | deepseek-v4-pro | 只读 | 规格符合度审查 |
| 代码审查 | `code-reviewer` | deepseek-v4-pro | 只读 | 代码质量审查 |
| 测试 | `tester` | deepseek-v4-flash | 读写 | 构建、测试、Playwright 验证 |
| 发布 | `release` | deepseek-v4-pro | 只读 | 交付收口汇总 |
