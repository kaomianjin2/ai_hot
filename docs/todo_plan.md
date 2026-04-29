# Todo Plan
Task Count: 3

## Rules

- 默认只读取第一条任务。
- 领取任务时，先读取本文件顶部 `Task Count`。
- 领取批次时，优先从第一条任务开始；仅为确认同批次依赖和不冲突范围时，继续读取必要的后续任务。
- 批量领取任务时，一次最多领取 3 个。
- 领取批次时，将批次任务从本文件移除并追加到 `docs/doing_plan.md`，同时将本文件 `Task Count` 按领取数量递减。
- 每个领取任务必须由 Coordinator 分配唯一 Owner 和 Write Scope。
- 本文件任务数 + `docs/doing_plan.md` 任务数 + `docs/done_plan.md` 任务数在任务前后必须不变。
- 任务不能凭空新增；本文件初始计划来自 `docs/development-plan.md`。
- 只有三个队列文件计划对不上时，才读取 `docs/development-plan.md` 矫正核查。

## Plans

### F0304 实现评分逻辑

- Phase: Sources
- Scope: `server/src/services/scoring.ts`
- Verify: 热点记录包含评分字段
- Depends On: F0302-F0303

### F0305 实现通知事件

- Phase: Notifications
- Scope: `server/src/services/notifications.ts`, `server/src/routes/notifications.ts`
- Verify: `rtk curl http://127.0.0.1:3000/api/notifications`
- Depends On: F0304

### F0306 前端通知中心

- Phase: Notifications
- Scope: `client/src/components/NotificationPanel.tsx`, `client/src/components/Topbar.tsx`
- Verify: Playwright 通知列表检查
- Depends On: F0207, F0305
