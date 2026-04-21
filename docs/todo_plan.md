# Todo Plan
Task Count: 20

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

### F0103 准备前端 Mock 数据

- Phase: Frontend
- Scope: `client/src/data/mockData.ts`
- Verify: `cd client && rtk npm run build`
- Depends On: F0102

### F0104 实现基础布局组件

- Phase: Frontend
- Scope: `client/src/components/*`, `client/src/App.tsx`
- Verify: Playwright 首屏检查
- Depends On: F0103

### F0105 实现热点雷达页面

- Phase: Frontend
- Scope: `client/src/components/*`, `client/src/App.tsx`
- Verify: Playwright 搜索和筛选检查
- Depends On: F0104

### F0106 实现监控词页面

- Phase: Frontend
- Scope: `client/src/components/*`, `client/src/App.tsx`
- Verify: Playwright 监控词添加和开关检查
- Depends On: F0104

### F0107 实现搜索页面

- Phase: Frontend
- Scope: `client/src/components/*`, `client/src/App.tsx`
- Verify: Playwright 搜索页检查
- Depends On: F0105

### F0108 实现立即扫描 Mock 行为

- Phase: Frontend
- Scope: `client/src/App.tsx`
- Verify: Playwright 点击扫描检查
- Depends On: F0105

### F0109 前端响应式与浏览器验证

- Phase: Frontend
- Scope: `client/src/styles.css`
- Verify: Playwright 390px/768px/1440px 截图
- Depends On: F0104-F0108

### F0201 创建后端工程

- Phase: Backend
- Scope: `server/*`
- Verify: `cd server && rtk npm run build`
- Depends On: -

### F0202 定义后端领域模型

- Phase: Backend
- Scope: `server/src/domain/types.ts`
- Verify: `cd server && rtk npm run build`
- Depends On: F0201

### F0203 初始化 SQLite

- Phase: Backend
- Scope: `server/src/db/*`
- Verify: 服务启动后检查数据表
- Depends On: F0202

### F0204 实现热点接口

- Phase: Backend
- Scope: `server/src/routes/hotItems.ts`
- Verify: `rtk curl http://127.0.0.1:3000/api/hot-items`
- Depends On: F0203

### F0205 实现监控词接口

- Phase: Backend
- Scope: `server/src/routes/keywords.ts`
- Verify: `rtk curl http://127.0.0.1:3000/api/keywords`
- Depends On: F0203

### F0206 实现手动扫描接口

- Phase: Backend
- Scope: `server/src/routes/scans.ts`, `server/src/services/scanner.ts`
- Verify: `rtk curl -X POST http://127.0.0.1:3000/api/scans/run`
- Depends On: F0204-F0205

### F0207 前端接入后端 API

- Phase: Integration
- Scope: `client/src/api/client.ts`, `client/src/App.tsx`
- Verify: 前端页面展示后端数据
- Depends On: F0109, F0206

### F0301 实现来源适配器接口

- Phase: Sources
- Scope: `server/src/sources/types.ts`
- Verify: `cd server && rtk npm run build`
- Depends On: F0206

### F0302 接入 RSS 来源

- Phase: Sources
- Scope: `server/src/sources/rss.ts`
- Verify: 扫描后 RSS 热点入库
- Depends On: F0301

### F0303 接入 GitHub 来源

- Phase: Sources
- Scope: `server/src/sources/github.ts`
- Verify: 扫描后 GitHub 热点入库
- Depends On: F0301

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
