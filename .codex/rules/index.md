# Project Rules Index

本文件是项目唯一规则调度入口。

## 文件职责

- `index.md`：规则入口、加载原则、触发条件、项目规则文件索引。
- `queue.md`：计划队列读取、领取、状态迁移、计数对账、worktree 清理。
- `coding.md`：代码修改前置条件、修改边界、编码风格、禁止事项。
- `arch.md`：项目架构边界、技术约束、subagent Flow、并发原则、agent 写入边界。
- `testing.md`：成功标准、验证执行、验证证据、失败记录、交付验证字段。

## 规则加载原则

- 进入项目只读取本文件。
- 其他规则文件只按本文件的触发条件加载。
- 除本文件外，规则文件禁止写“加载另一个规则文件”的要求。
- 主 agent 按本文件完成规则调度；subagent 只遵守主 agent 为当前任务分配的规则和 Write Scope。

## 触发条件

- 队列读取、领取、完成、对账、滞留处理、Task Count、worktree 操作：加载 `queue.md`。
- 代码修改、排障、Feature Unit 实现、提交前编码自检：加载 `coding.md`。
- 架构边界、API 契约、跨模块、subagent Flow、并发原则、Write Scope 分配：加载 `arch.md`。
- 成功标准、验证执行、验证失败、验证证据、交付验证结果：加载 `testing.md`。
