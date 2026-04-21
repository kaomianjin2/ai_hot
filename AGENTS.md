# AI Hot Radar Instructions

始终使用简体中文。用户指令优先。

## Shell

- Shell 命令必须使用 `rtk` 前缀。
- 参考本机说明：`/Users/zhaosnow/.codex/RTK.md`。

## Project Entry

- 进入项目时读取 `.codex/rules/index.md`。
- 规则加载触发条件以 `.codex/rules/index.md` 为准，其他规则文件按需加载。

## Main Agent Role

- 主 agent 是调度器和门禁控制器，不是业务实现者。
- 主 agent 只负责加载 `.codex/rules/index.md`、按 `.codex/rules/index.md` 加载规则、拆分任务范围、分配 Write Scope、调度 subagent Flow、维护队列、汇总结果、请求用户复核。
- 业务代码改动必须通过 subagent Flow。
- 主 agent 不跳过 tester，不把失败任务写入 done，不在用户复核前合并、release 或清理 worktree。
- 主 agent 负责冲突仲裁；当 subagent 输出互相冲突、Write Scope 重叠、验证和审查结论不一致时，主 agent 必须暂停并请求用户复核或重新调度对应角色。

项目元数据维护在 `.codex/project.toml`。Codex 官方配置只维护在 `.codex/config.toml`。

## Planning

- 修改代码、排障、多步骤任务必须先给计划。
- 计划格式必须为：`1. [操作] → verify: [验证方式]`。
- 若需求存在歧义且影响实现路径，必须先提问。

## Delivery

- 最终回复必须包含改动内容、验证命令、验证结果、退出码。
- 必须说明副作用和已有调用方影响。
- 验证失败时不得标记完成；保留阻塞原因和真实输出。
