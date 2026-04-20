# AI Hot Radar Instructions

始终使用简体中文。用户指令优先。

## Shell

- Shell 命令必须使用 `rtk` 前缀。
- 参考本机说明：`/Users/zhaosnow/.codex/RTK.md`。

## Project Entry

1. 读取 `.codex/rules/index.md`。
2. 读取 `docs/doing_plan.md` 顶部 `Task Count` 和滞留任务。
3. 读取 `docs/todo_plan.md` 顶部 `Task Count` 和第一条任务。
4. 读取 `docs/done_plan.md` 顶部 `Task Count`。

项目元数据维护在 `.codex/project.toml`。Codex 官方配置只维护在 `.codex/config.toml`。

## Planning

- 修改代码、排障、多步骤任务必须先给计划。
- 计划格式必须为：`1. [操作] → verify: [验证方式]`。
- 若需求存在歧义且影响实现路径，必须先提问。

## Rule Loading

- 队列协议：`.codex/rules/queue.md`
- 编码规则：`.codex/rules/coding.md`
- 架构规则：`.codex/rules/arch.md`
- 验证规则：`.codex/rules/testing.md`

## Delivery

- 最终回复必须包含改动内容、验证命令、验证结果、退出码。
- 必须说明副作用和已有调用方影响。
- 验证失败时不得标记完成；保留阻塞原因和真实输出。
