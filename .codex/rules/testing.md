# Testing Rules

## 成功标准

- 修改前必须定义成功标准。
- 功能开发必须验证输入、输出、至少 1 个边界情况。
- Bug 修复必须按顺序提供复现方式、定位原因、修复、验证。

## 完成门禁

- 每个 Feature Unit 必须执行 `docs/development-plan.md` 中 `Verify` 声明的最小验证。
- 只有真实执行验证、tester PASS 且用户复核 PASS 的 Feature Unit 才能算完成。
- tester PASS 后必须立即进入用户复核；用户未明确复核通过前，禁止移动计划状态、写入 done、合并、删除 worktree、执行 worktree prune 或触发 release。
- 禁止伪造验证通过。
- 未运行命令、命令失败、输出缺失、只凭推断都不能记为通过。

## 记录要求

完成记录必须包含：

- Feature Unit ID
- Owner
- Write Scope
- 验证命令
- 真实输出
- 退出码
- PASS / FAIL / BLOCKED 结论
- 用户复核状态和用户复核来源
- 副作用
- 已有调用方影响

## 失败处理

- 验证失败时，任务必须留在 `docs/doing_plan.md`。
- 状态标记为 `Blocked` 或继续修复。
- 禁止把失败任务移动到 `docs/done_plan.md`。
- 前端页面设计或视觉改动的 Playwright 真实浏览器验证失败时，主 Agent 必须调度对应实现 subagent 修复，并在修复后重新交给 tester 验证。

## 最小验证

- Frontend：build、Playwright 关键交互、响应式截图。
- 前端页面设计或视觉改动：必须使用 Playwright 进入真实浏览器验证关键页面、关键交互和至少 1 个响应式视口。
- Backend：build、health、API curl。
- Storage：schema 创建、insert、update、read。
- Integration：UI 读取 API 数据、API 失败态可见。

## 交付回复

- 最终回复必须包含改动内容、验证命令、验证结果、退出码。
- 必须说明副作用和已有调用方影响。
- 验证失败时不得标记完成；保留阻塞原因和真实输出。
