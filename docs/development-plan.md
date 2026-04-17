# AI Hot Radar Development Plan

## 1. 结论

AI Hot Radar 第一版按“Web 控制台优先、后端能力渐进接入、真实热点和通知最后补齐”的路线开发。

开发粒度以 Feature Unit 为单位，每个 Feature Unit 必须能独立验证，并且必须同步维护 `docs/progress.md`。

## 1.1 文档职责

项目前置规则统一维护在 `AGENTS.md`；本文件只维护开发范围、阶段拆分、Feature Unit 粒度和验收标准。

## 2. 项目目标

构建一个 Web 端 AI 热点监控工具，用于自动发现 AI 相关热点并及时通知用户。

核心场景：

- 查看 AI 热点流
- 搜索热点
- 管理监控词
- 手动触发扫描
- 自动发现新热点
- 命中监控词或高热度热点后发送通知

## 3. 当前状态

已完成资产：

- `design/ai-hot-radar.html`
  - 静态 Web UI 原型
  - 已包含热点雷达、监控词、搜索页面
  - 已验证搜索、筛选、监控词、扫描按钮基础交互
- `docs/ui-design-plan.md`
  - UI 设计计划
- `docs/web-ui-development-plan.md`
  - 旧版 Web UI 开发计划
- `output/playwright/*.png`
  - 参考图和本地页面验证截图

当前缺口：

- 缺少正式前端工程
- 缺少后端服务
- 缺少真实热点采集
- 缺少数据持久化
- 缺少通知能力
- 缺少自动化回归测试

## 4. 技术选型

### 4.1 前端

- React
- Vite
- TypeScript
- CSS
- Playwright 验证

约束：

- 不引入 UI 组件库
- 不引入图标库
- 不接 Figma
- 视觉基准以 `design/ai-hot-radar.html` 为准

### 4.2 后端

- Node.js
- Fastify
- TypeScript
- SQLite
- 定时任务

约束：

- 第一版不引入 Redis
- 第一版不引入消息队列
- 第一版不引入 Docker
- 第一版不做登录权限

### 4.3 数据库

第一版使用 SQLite。

取舍原因：

- 单机部署成本低
- 适合 MVP
- 便于本地验证
- 后续可迁移 PostgreSQL

## 5. 开发阶段

## Phase 0: 文档与进度机制

目标：建立可追踪开发机制，确保每个细粒度功能都有状态和验证记录。

### F0001 创建总开发计划文档

影响范围：

- `docs/development-plan.md`

操作：

1. [创建开发计划文档] → verify: `rtk test -f docs/development-plan.md`
2. [写入阶段、粒度、技术栈、接口、验证标准] → verify: `rtk sed -n '1,260p' docs/development-plan.md`

成功标准：

- 文档存在
- 内容覆盖前端、后端、采集、通知
- 每个阶段都有可验证任务

### F0002 创建实时进度文档

影响范围：

- `docs/progress.md`

操作：

1. [创建进度文档] → verify: `rtk test -f docs/progress.md`
2. [写入 Feature Units 表格] → verify: `rtk rg "Feature Units" docs/progress.md`
3. [写入 Bug Fix Log 表格] → verify: `rtk rg "Bug Fix Log" docs/progress.md`

成功标准：

- 文档存在
- 包含状态定义
- 包含 Feature Units 表格
- 包含 Bug Fix Log 表格

### F0003 登记当前 UI 原型状态

影响范围：

- `docs/progress.md`

操作：

1. [登记静态 UI 原型为 Done] → verify: `rtk rg "design/ai-hot-radar.html" docs/progress.md`
2. [登记 Playwright 截图证据] → verify: `rtk rg "output/playwright" docs/progress.md`

成功标准：

- 当前已完成 UI 工作被记录
- 记录中包含验证截图路径
- 记录中包含已知限制

## Phase 1: Web 前端工程化

目标：把当前静态 UI 原型迁移成可维护的 React Web 应用。

### F0101 创建前端工程

影响范围：

- `client/package.json`
- `client/src/main.tsx`
- `client/src/App.tsx`
- `client/src/styles.css`

操作：

1. [创建 Vite React TypeScript 项目] → verify: `rtk test -f client/package.json`
2. [安装前端依赖] → verify: `cd client && rtk npm install`
3. [运行构建] → verify: `cd client && rtk npm run build`

成功标准：

- `client` 目录存在
- 构建通过
- 无 TypeScript 错误

### F0102 定义前端领域类型

影响范围：

- `client/src/types/domain.ts`

操作：

1. [定义 HotItem 类型] → verify: `rtk rg "type HotItem" client/src/types/domain.ts`
2. [定义 MonitorKeyword 类型] → verify: `rtk rg "type MonitorKeyword" client/src/types/domain.ts`
3. [定义 StatItem 类型] → verify: `rtk rg "type StatItem" client/src/types/domain.ts`
4. [运行构建] → verify: `cd client && rtk npm run build`

成功标准：

- 类型集中维护
- 构建通过
- 无未使用类型报错

### F0103 准备前端 Mock 数据

影响范围：

- `client/src/data/mockData.ts`

操作：

1. [迁移热点 mock 数据] → verify: `rtk rg "mockHotItems" client/src/data/mockData.ts`
2. [迁移监控词 mock 数据] → verify: `rtk rg "mockMonitorKeywords" client/src/data/mockData.ts`
3. [迁移统计 mock 数据] → verify: `rtk rg "mockStats" client/src/data/mockData.ts`
4. [运行构建] → verify: `cd client && rtk npm run build`

成功标准：

- Mock 数据可供页面渲染
- 数据字段与领域类型一致
- 构建通过

### F0104 实现基础布局组件

影响范围：

- `client/src/components/Topbar.tsx`
- `client/src/components/Tabs.tsx`
- `client/src/components/StatsGrid.tsx`
- `client/src/App.tsx`

操作：

1. [实现 Topbar] → verify: 页面包含 `AI Hot Radar`
2. [实现 Tabs] → verify: 页面包含 `热点雷达`、`监控词`、`搜索`
3. [实现 StatsGrid] → verify: 页面包含 `总热点`、`今日新增`、`紧急热点`、`监控词`
4. [运行构建] → verify: `cd client && rtk npm run build`

成功标准：

- 首屏结构与静态原型一致
- Tab 当前状态有高亮
- 构建通过

### F0105 实现热点雷达页面

影响范围：

- `client/src/components/Toolbar.tsx`
- `client/src/components/SearchPanel.tsx`
- `client/src/components/HotList.tsx`
- `client/src/components/HotCard.tsx`
- `client/src/App.tsx`

操作：

1. [实现排序工具栏] → verify: 页面包含 `最新发现`、`最新发布`、`重要程度`、`相关性`、`热度综合`
2. [实现筛选按钮] → verify: 点击筛选按钮展开筛选区
3. [实现热点搜索框] → verify: 输入关键词后热点列表变化
4. [实现热点卡片列表] → verify: 页面渲染热点标题、摘要、标签、查看按钮
5. [运行构建] → verify: `cd client && rtk npm run build`

成功标准：

- 搜索有效
- 筛选按钮有效
- 重置按钮有效
- 空结果有空状态

### F0106 实现监控词页面

影响范围：

- `client/src/components/MonitorKeywordGrid.tsx`
- `client/src/components/MonitorKeywordCard.tsx`
- `client/src/App.tsx`

操作：

1. [实现监控词输入框] → verify: 页面包含关键词输入框
2. [实现添加监控词] → verify: 输入新关键词后卡片数量增加
3. [实现监控词开关] → verify: 点击开关后 active 状态变化
4. [实现重复关键词拦截] → verify: 重复添加不会生成重复卡片
5. [运行构建] → verify: `cd client && rtk npm run build`

成功标准：

- 空输入不新增
- 重复输入不新增
- 新关键词可新增
- 开关状态可切换

### F0107 实现搜索页面

影响范围：

- `client/src/components/SearchPanel.tsx`
- `client/src/components/Toolbar.tsx`
- `client/src/components/HotList.tsx`
- `client/src/App.tsx`

操作：

1. [实现全局搜索输入框] → verify: 输入 `GitHub` 返回 GitHub 结果
2. [实现搜索筛选区] → verify: 来源筛选会改变结果
3. [实现搜索重置] → verify: 点击重置后恢复全部来源
4. [实现搜索空状态] → verify: 无匹配结果时显示空状态
5. [运行构建] → verify: `cd client && rtk npm run build`

成功标准：

- 搜索按钮有效
- 回车搜索有效
- 筛选有效
- 重置有效

### F0108 实现立即扫描 Mock 行为

影响范围：

- `client/src/App.tsx`

操作：

1. [实现扫描按钮 loading 状态] → verify: 点击后按钮文案变化
2. [实现新增热点插入列表顶部] → verify: 扫描完成后热点数量 +1
3. [实现统计数字更新] → verify: 总热点和今日新增 +1
4. [运行构建] → verify: `cd client && rtk npm run build`

成功标准：

- 扫描期间按钮不可重复点击
- 扫描完成后新增热点可见
- 统计数字同步变化

### F0109 前端响应式与浏览器验证

影响范围：

- `client/src/styles.css`

操作：

1. [验证桌面端 1440px] → verify: Playwright 截图无布局错位
2. [验证平板端 768px] → verify: Playwright 截图无横向滚动
3. [验证移动端 390px] → verify: Playwright 截图无横向滚动
4. [验证 console] → verify: Playwright console error 数量为 0

成功标准：

- 390px 无横向滚动
- 文本不溢出按钮
- 卡片不互相遮挡
- console 无 error

## Phase 2: 后端 MVP

目标：提供可持久化的数据接口，让前端从 mock 切换到 API。

### F0201 创建后端工程

影响范围：

- `server/package.json`
- `server/src/index.ts`

操作：

1. [创建后端 TypeScript 工程] → verify: `rtk test -f server/package.json`
2. [实现 Fastify 启动入口] → verify: `cd server && rtk npm run build`
3. [启动健康检查接口] → verify: `rtk curl http://127.0.0.1:3000/health`

成功标准：

- 后端可启动
- `/health` 返回成功
- 构建通过

### F0202 定义后端领域模型

影响范围：

- `server/src/domain/types.ts`

操作：

1. [定义 HotItem] → verify: `rtk rg "HotItem" server/src/domain/types.ts`
2. [定义 MonitorKeyword] → verify: `rtk rg "MonitorKeyword" server/src/domain/types.ts`
3. [定义 NotificationEvent] → verify: `rtk rg "NotificationEvent" server/src/domain/types.ts`
4. [运行构建] → verify: `cd server && rtk npm run build`

成功标准：

- 前后端字段保持一致
- 构建通过

### F0203 初始化 SQLite

影响范围：

- `server/src/db/index.ts`
- `server/src/db/schema.ts`

操作：

1. [创建数据库连接] → verify: 服务启动时无数据库错误
2. [创建热点表] → verify: SQLite 中存在 `hot_items`
3. [创建监控词表] → verify: SQLite 中存在 `monitor_keywords`
4. [创建通知表] → verify: SQLite 中存在 `notification_events`

成功标准：

- 服务启动自动初始化表
- 重启后数据保留

### F0204 实现热点接口

影响范围：

- `server/src/routes/hotItems.ts`

接口：

```text
GET /api/hot-items
GET /api/hot-items/:id
```

操作：

1. [实现热点列表查询] → verify: `rtk curl http://127.0.0.1:3000/api/hot-items`
2. [实现关键词查询] → verify: `rtk curl "http://127.0.0.1:3000/api/hot-items?q=GitHub"`
3. [实现来源筛选] → verify: `rtk curl "http://127.0.0.1:3000/api/hot-items?source=github"`

成功标准：

- 返回 JSON
- 支持关键词查询
- 支持来源筛选

### F0205 实现监控词接口

影响范围：

- `server/src/routes/keywords.ts`

接口：

```text
GET /api/keywords
POST /api/keywords
PATCH /api/keywords/:id
```

操作：

1. [实现监控词列表] → verify: `rtk curl http://127.0.0.1:3000/api/keywords`
2. [实现新增监控词] → verify: `rtk curl -X POST http://127.0.0.1:3000/api/keywords`
3. [实现启停监控词] → verify: `rtk curl -X PATCH http://127.0.0.1:3000/api/keywords/<id>`

成功标准：

- 可新增关键词
- 重复关键词不新增
- 可切换 active 状态

### F0206 实现手动扫描接口

影响范围：

- `server/src/routes/scans.ts`
- `server/src/services/scanner.ts`

接口：

```text
POST /api/scans/run
```

操作：

1. [实现扫描入口] → verify: `rtk curl -X POST http://127.0.0.1:3000/api/scans/run`
2. [写入扫描结果] → verify: 调用后热点数量增加
3. [返回 scanId] → verify: 响应 JSON 包含 `scanId`

成功标准：

- 接口可触发扫描
- 扫描结果入库
- 重复热点不重复入库

### F0207 前端接入后端 API

影响范围：

- `client/src/api/client.ts`
- `client/src/App.tsx`

操作：

1. [实现 API client] → verify: `rtk rg "fetchHotItems" client/src/api/client.ts`
2. [热点列表接入 API] → verify: 页面热点数据来自后端
3. [监控词接入 API] → verify: 页面监控词数据来自后端
4. [扫描按钮接入 API] → verify: 点击后调用 `POST /api/scans/run`

成功标准：

- 后端启动时前端展示真实 API 数据
- 后端异常时前端显示错误状态
- 页面不白屏

## Phase 3: 真实热点采集与通知

目标：接入真实 AI 热点来源，完成去重、评分和通知。

### F0301 实现来源适配器接口

影响范围：

- `server/src/sources/types.ts`

接口：

```ts
export type HotItemDraft = {
  source: string
  title: string
  summary: string
  url: string
  tags: string[]
  publishedAt: string
}

export type SourceAdapter = {
  name: string
  fetchLatest: () => Promise<HotItemDraft[]>
}
```

操作：

1. [定义 HotItemDraft] → verify: `rtk rg "HotItemDraft" server/src/sources/types.ts`
2. [定义 SourceAdapter] → verify: `rtk rg "SourceAdapter" server/src/sources/types.ts`
3. [运行构建] → verify: `cd server && rtk npm run build`

成功标准：

- 后续来源适配器统一返回同一结构

### F0302 接入 RSS 来源

影响范围：

- `server/src/sources/rss.ts`

操作：

1. [实现 RSS 拉取] → verify: 扫描后返回 RSS 热点
2. [转换为 HotItemDraft] → verify: 返回字段完整
3. [入库去重] → verify: 同 URL 不重复入库

成功标准：

- RSS 热点可进入热点列表
- 无重复 URL

### F0303 接入 GitHub 来源

影响范围：

- `server/src/sources/github.ts`

操作：

1. [实现 GitHub AI 关键词搜索] → verify: 扫描后返回 GitHub 相关项目
2. [转换为 HotItemDraft] → verify: 返回字段完整
3. [入库去重] → verify: 同 URL 不重复入库

成功标准：

- GitHub AI 热点可进入热点列表
- 标签包含 `GitHub` 或 `Open Source`

### F0304 实现评分逻辑

影响范围：

- `server/src/services/scoring.ts`

操作：

1. [实现 relevanceScore] → verify: AI 关键词命中越多分数越高
2. [实现 heatScore] → verify: 新发布时间、来源权重影响分数
3. [写入数据库] → verify: 热点记录包含评分字段

成功标准：

- 每条热点都有 `heatScore`
- 每条热点都有 `relevanceScore`
- 高分热点排序靠前

### F0305 实现通知事件

影响范围：

- `server/src/services/notifications.ts`
- `server/src/routes/notifications.ts`

接口：

```text
GET /api/notifications
PATCH /api/notifications/:id/read
```

操作：

1. [实现通知事件生成] → verify: 高分热点生成通知
2. [实现通知列表接口] → verify: `rtk curl http://127.0.0.1:3000/api/notifications`
3. [实现已读接口] → verify: PATCH 后未读数量减少

成功标准：

- 高分热点生成通知
- 命中监控词生成通知
- 24 小时内同一热点只通知一次

### F0306 前端通知中心

影响范围：

- `client/src/components/NotificationPanel.tsx`
- `client/src/components/Topbar.tsx`

操作：

1. [显示未读通知角标] → verify: 角标数量与 API 一致
2. [点击通知按钮展示通知列表] → verify: 通知列表可见
3. [点击通知标记已读] → verify: 未读数量减少

成功标准：

- 通知角标准确
- 通知列表可打开
- 已读状态可更新

## 6. 数据结构

### HotItem

```ts
export type HotItem = {
  id: string
  source: string
  title: string
  summary: string
  url: string
  tags: string[]
  heatScore: number
  relevanceScore: number
  publishedAt: string
  discoveredAt: string
}
```

### MonitorKeyword

```ts
export type MonitorKeyword = {
  id: string
  text: string
  active: boolean
  hitCount: number
  createdAt: string
}
```

### NotificationEvent

```ts
export type NotificationEvent = {
  id: string
  hotItemId: string
  title: string
  reason: string
  read: boolean
  createdAt: string
}
```

## 7. API 清单

```text
GET    /health

GET    /api/hot-items
GET    /api/hot-items/:id

GET    /api/keywords
POST   /api/keywords
PATCH  /api/keywords/:id

POST   /api/scans/run

GET    /api/notifications
PATCH  /api/notifications/:id/read
```

## 8. 验证标准

### 前端验证

```bash
cd client
rtk npm run build
```

Playwright 验证：

```bash
rtk python3 -m http.server 4173
rtk /Users/zhaosnow/.codex/skills/playwright/scripts/playwright_cli.sh open http://127.0.0.1:4173
```

必须验证：

- Tab 可切换
- 热点搜索有效
- 搜索页搜索有效
- 监控词可添加
- 监控词开关可切换
- 扫描按钮有效
- 390px 无横向滚动
- console error 为 0

### 后端验证

```bash
cd server
rtk npm run build
rtk npm run dev
```

接口验证：

```bash
rtk curl http://127.0.0.1:3000/health
rtk curl http://127.0.0.1:3000/api/hot-items
rtk curl http://127.0.0.1:3000/api/keywords
rtk curl -X POST http://127.0.0.1:3000/api/scans/run
```

## 9. 进度维护规则

每个 Feature Unit 开发前：

1. 在 `docs/progress.md` 新增或更新该 Feature Unit
2. 将状态设置为 `In Progress`
3. 填写影响范围
4. 填写验证方式

每个 Feature Unit 开发后：

1. 运行最小必要验证
2. 将状态设置为 `Done` 或 `Blocked`
3. 填写验证结果
4. 填写副作用
5. 填写是否影响已有调用方

Bug 修复流程：

1. 记录复现方式
2. 记录定位原因
3. 记录修复范围
4. 记录验证命令
5. 验证通过后标记 `Done`

## 10. 暂不实现

第一版暂不实现：

- 登录权限
- 多用户
- Docker 部署
- Redis
- 消息队列
- PostgreSQL
- WebSocket 实时推送
- 移动 App
- 小程序
- Figma
- 复杂权限系统
- AI 自动总结长文
