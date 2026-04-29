# Doing Plan
Task Count: 0

## Rules

- 本文件可为空，也可保存一个批次内的多条任务。
- 开始新任务前必须读取本文件顶部 `Task Count`。
- 如果本文件滞留有任务，必须先核查解决。
- 滞留任务已完成时，补齐记录并移动到 `docs/done_plan.md`。
- 滞留任务未完成时，继续执行该任务。
- 滞留任务阻塞时，记录阻塞原因并保留在本文件。
- 领取批次时，将本文件 `Task Count` 按领取数量递增。
- 每条任务必须包含 `Owner`、`Write Scope`、`State`。
- `State` 只允许使用 `In Progress`、`Blocked`、`Ready For QA`。
- `Ready For QA` 只表示等待 tester 验证，不表示完成。
- 每个 Feature Unit 必须由 tester 真实执行 `Verify` 声明的最小验证。
- 禁止伪造验证通过；未运行命令、命令失败、输出缺失、只凭推断都不能记为通过。
- 任务真实验证通过后，才能从本文件移除并追加到 `docs/done_plan.md`，同时将本文件 `Task Count` 按完成数量递减。
- 验证失败的任务必须保留在本文件，状态标记为 `Blocked` 或继续修复。
- 本文件任务数 + `docs/todo_plan.md` 任务数 + `docs/done_plan.md` 任务数在任务前后必须不变。
- 禁止两个任务声明重叠的 `Write Scope`。

## Plans

