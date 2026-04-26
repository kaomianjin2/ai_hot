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
- 共享入口文件默认串行，包括 `client/src/App.tsx`、`client/src/components/Topbar.tsx` 和后端扫描链路服务文件。
- 依赖同一个未完成上游的任务禁止并行；依赖同一个已完成上游的任务，只有写入文件完全独立时才允许并行。
- 状态迁移时同步更新源队列和目标队列的 `Task Count`。
- 每条 doing 任务必须包含 `Owner`、`Write Scope`、`State`。
- `State` 只允许 `In Progress`、`Blocked`、`Ready For QA`。
- 禁止两个任务声明重叠的 `Write Scope`。

## 完成

- `Ready For QA` 只表示等待 tester 验证，不表示完成。
- tester PASS 结果已汇总，且用户复核 PASS 后，才能从 `docs/doing_plan.md` 移动到 `docs/done_plan.md`。
- 用户未明确复核通过前，禁止移动计划状态、写入 `docs/done_plan.md`、删除 worktree 或执行 `rtk git worktree prune`。
- 任务移动到 `docs/done_plan.md` 后，必须移除当前任务 worktree，并执行 `rtk git worktree prune`。
- 移除 worktree 后必须执行 `rtk git worktree list` 和 `rtk git status --short` 验证清理结果。
- 验证失败的任务保留在 `docs/doing_plan.md`，状态标记为 `Blocked`。
- `todo + doing + done` 任务总数必须保持不变。
- 三份队列顶部 `Task Count` 必须唯一、准确。
- `todo + doing + done` 总数必须等于 `docs/development-plan.md` 的 Feature Unit 总数。
- 任务队列移动完成后，必须将任务 worktree 分支合并到主分支，再在主分支自动执行 `rtk git add`、`rtk git commit` 和 `rtk git push`。
- 自动提交说明必须使用中文，只需写明本次完成了什么工作。

## 矫正

- 只有三个队列文件的计划数量、任务 ID 或任务来源对不上时，才读取 `docs/development-plan.md`。
- `docs/development-plan.md` 是 Feature Unit 存档，不是日常状态文件。
- 禁止读取或恢复已清除的旧进度文件和旧 UI 计划文件。
