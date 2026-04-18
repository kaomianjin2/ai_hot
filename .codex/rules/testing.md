# Testing Rules

## 完成门禁

- 每个 Feature Unit 必须执行 `docs/development-plan.md` 中 `Verify` 声明的最小验证。
- 只有真实执行验证且结果通过的 Feature Unit 才能算完成。
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
- 副作用
- 已有调用方影响

## 失败处理

- 验证失败时，任务必须留在 `docs/doing_plan.md`。
- 状态标记为 `Blocked` 或继续修复。
- 禁止把失败任务移动到 `docs/done_plan.md`。

## 最小验证

- Frontend：build、Playwright 关键交互、响应式截图。
- Backend：build、health、API curl。
- Storage：schema 创建、insert、update、read。
- Integration：UI 读取 API 数据、API 失败态可见。
