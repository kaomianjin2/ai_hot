# Queue Rules

## 读取

- 每次开始任务前读取三份队列顶部 `Task Count`。
- `docs/doing_plan.md` 有任务时，必须先核查滞留原因。
- 未核查滞留任务前禁止领取新批次。
- 默认只读取 `docs/todo_plan.md` 第一条；仅为确认同批次依赖和写入范围时，继续读取必要后续任务。

## 领取

- 任务不能凭空捏造、改名或跳号，只能从现有队列移动。
- 领取批次时，从 `docs/todo_plan.md` 移除任务并追加到 `docs/doing_plan.md`。
- 批量领取任务时，一次最多领取 3 个。
- 同步更新两个文件的 `Task Count`。
- 每条 doing 任务必须包含 `Owner`、`Write Scope`、`State`。
- `State` 只允许 `In Progress`、`Blocked`、`Ready For QA`。
- 禁止两个任务声明重叠的 `Write Scope`。

## 完成

- `Ready For QA` 只表示等待 tester 验证，不表示完成。
- 每个 Feature Unit 必须由 tester 真实执行 `Verify` 声明的最小验证。
- 验证通过后才能从 `docs/doing_plan.md` 移动到 `docs/done_plan.md`。
- 验证失败的任务保留在 `docs/doing_plan.md`，状态标记为 `Blocked` 或继续修复。
- `todo + doing + done` 任务总数必须保持不变。

## 矫正

- 只有三个队列文件的计划数量、任务 ID 或任务来源对不上时，才读取 `docs/development-plan.md`。
- `docs/development-plan.md` 是 Feature Unit 存档，不是日常状态文件。
