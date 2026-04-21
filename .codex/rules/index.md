# Project Rules Index

本文件是项目规则入口。Codex 官方配置只维护在 `.codex/config.toml`；项目元数据维护在 `.codex/project.toml`；工作流细则维护在本目录。

## Always Load

- `.codex/rules/queue.md`：进入项目、领取任务、完成任务、队列对账、处理滞留任务。

## Load When Needed

- `.codex/rules/coding.md`：修改代码、排障、实现 Feature Unit。
- `.codex/rules/arch.md`：架构设计、接口设计、前后端集成、并行开发、跨模块变更、Feature Unit 执行、bug 修复、代码改动、业务操作 subagent 驱动。
- `.codex/rules/testing.md`：验证、交付、移动任务到 done。

## Project Metadata

- 项目元数据：`.codex/project.toml`
- Subagent 定义：`.codex/agents/*.toml`
- 当前任务：`docs/doing_plan.md`
- 待做任务：`docs/todo_plan.md`
- 已完成任务：`docs/done_plan.md`
- 开发计划存档：`docs/development-plan.md`
