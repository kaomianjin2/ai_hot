# Queue Rules

## 职责

- 本文件只定义计划队列读取、领取、状态迁移、计数对账和 worktree 清理。
- 本文件不定义 subagent Flow、代码修改规范、验证命令、验证证据格式。

## 队列读取

- 每次开始任务前读取三份队列顶部 `Task Count`。
- `docs/doing_plan.md` 有任务时，必须先核查滞留原因。
- 未核查滞留任务前禁止领取新批次。
- 处理滞留任务时，读取 `docs/doing_plan.md` 滞留任务。
- 队列对账时，读取三份队列文件；只有队列总数不一致、计划审查、计划矫正时，才读取 `docs/development-plan.md`。
- 默认只读取 `docs/todo_plan.md` 第一条；仅为确认同批次依赖和写入范围时，继续读取必要后续任务。
- 非必要不读取 `docs/development-plan.md`。

## 领取

- 任务不能凭空捏造、改名或跳号，只能从现有队列移动。
- 领取批次时，从 `docs/todo_plan.md` 移除任务并追加到 `docs/doing_plan.md`。
- 领取后进入业务开发前，必须在当前项目目录下创建独立 git worktree，路径使用 `./worktrees/<task-id>`。
- 批量领取任务时，一次最多领取 3 个。
- 批量领取只允许领取 `Depends On` 已经进入 `docs/done_plan.md` 的任务。
- 同批任务的 `Write Scope` 必须精确到最终文件或目录，不能重叠到同一文件、同一共享入口或同一未拆分目录。
- 共享入口文件默认串行，任何修改必须独占领取：
  - 前端：`client/src/App.tsx`、`client/src/main.tsx`、`client/src/components/Topbar.tsx`、`client/vite.config.ts`、`client/tsconfig*.json`、`client/package.json`、`client/src/styles.css`
  - 后端：`server/src/index.ts`、`server/src/app.ts`、`server/src/db/schema.ts`、`server/tsconfig.json`、`server/package.json`
  - 根：`package.json`、`.gitignore`、`CLAUDE.md`、`.claude/rules/*`、`.claude/agents/*`
  - 通用规则：被 ≥2 个 Feature Unit 在 Scope 中引用的文件，自动按共享入口处理。
- 依赖同一个未完成上游的任务禁止并行；依赖同一个已完成上游的任务，只有写入文件完全独立时才允许并行。
- 状态迁移时同步更新源队列和目标队列的 `Task Count`。
- 每条 doing 任务必须包含 `Owner`、`Channel`、`Write Scope`、`State`。
- `Channel` 只允许 `Light`、`Heavy`。
- `State` 只允许 `In Progress`、`Blocked`、`Done Pending`、`Withdrawn`。
- 禁止两个任务声明重叠的 `Write Scope`。

## 完成

- tester PASS（退出码 0 且输出符合验收）后，主 agent 直接将任务从 `docs/doing_plan.md` 移动到 `docs/done_plan.md`，不再设用户复核环节。
- 完成记录字段不再包含 `User Review`、`User Review Source`。
- 单任务完成顺序：worktree 分支合并到主分支 → 移动计划状态、写入 done → 删除 worktree 并执行 `rtk git worktree prune`。
- 同批次所有任务完成后，主 agent 统一在主分支执行 `rtk git add`、`rtk git commit`、`rtk git push`，使用单条总结性中文提交说明，避免历史碎片化。
- 移除 worktree 后必须执行 `rtk git worktree list` 和 `rtk git status --short` 验证清理结果。
- 验证失败的任务保留在 `docs/doing_plan.md`，状态标记为 `Blocked`。
- `todo + doing + done` 任务总数必须保持不变（Withdrawn 任务退回 todo 末尾，仍计入守恒）。
- 三份队列顶部 `Task Count` 必须唯一、准确。
- `todo + doing + done` 总数必须等于 `docs/development-plan.md` 的 Feature Unit 总数。

## 撤回

- 探索后发现需求不可行、被其它任务覆盖或重复时，主 agent 可将任务标记 `Withdrawn`。
- Withdrawn 任务从 doing 移回 todo 末尾，附 `State: Withdrawn` 与撤回原因。
- Withdrawn 不计入 done。

## 矫正

- 只有三个队列文件的计划数量、任务 ID 或任务来源对不上时，才读取 `docs/development-plan.md`。
- `docs/development-plan.md` 是 Feature Unit 存档，不是日常状态文件。
- 禁止读取或恢复已清除的旧进度文件和旧 UI 计划文件。
