# AI Hot Radar Development Plan

## 1. Goal

Web 端 AI 热点监控工具：热点流、搜索、监控词、手动扫描、自动采集、通知。

第一版目标是单机可运行、可验证、可扩展来源的最小完整产品。

## 2. What Already Exists

| Asset | State | Reuse |
| --- | --- | --- |
| `design/ai-hot-radar.html` | Done | 作为 UI 视觉、布局、状态和响应式参考 |
| `.codex/config.toml` | Done | 定义主 Agent 和 subagent 调度入口 |
| `.codex/agents/*.toml` | Done | 定义 planner、ui_designer、explorer、frontend、backend、integrator、spec_reviewer、code_reviewer、tester、release |
| `docs/todo_plan.md` | Done | 待领取 Feature Unit 队列 |
| `docs/doing_plan.md` | Done | 批次 Doing 队列 |
| `docs/done_plan.md` | Done | 完成记录队列 |

当前不存在 `client/`、`server/`、测试配置、运行脚本和 CI。开发从工程初始化开始。

## 3. Scope Challenge

| Check | Result | Decision |
| --- | --- | --- |
| 最小变更 | 前端、后端、SQLite、来源、通知是第一版闭环 | 保留 |
| 复杂度 | 22 个 Feature Unit，分批执行，不一次性大改 | 保留批次模型 |
| 自定义基础设施 | 不引入 Redis、队列、Docker、登录、多用户 | 延后 |
| 已有实现复用 | 复用静态原型，不重做设计文档 | 保留 `design/ai-hot-radar.html` |
| 分发 | 第一版只要求本地运行，不发布包和部署 | 明确不在范围 |

## 4. Tech Stack

| Area | Stack | Constraint |
| --- | --- | --- |
| Frontend | React + Vite + TypeScript + CSS | 不引入 UI 组件库 / 图标库 / Figma |
| Backend | Node.js + Fastify + TypeScript | 第一版不做登录 |
| Storage | SQLite | 第一版单机持久化 |
| QA | Build + API curl + Playwright | 每个 Feature Unit 独立验证 |

## 5. Data Flow

```text
User
  |
  v
React UI
  | search/filter/keyword/scan
  v
Fastify API
  | read/write
  v
SQLite
  ^
  | scanner writes hot items, scores, notifications
  |
Sources: Mock -> RSS -> GitHub
```

## 6. Feature Units

| ID | Plan | Phase | Scope | Verify | Depends On |
| --- | --- | --- | --- | --- | --- |
| F0101 | 创建前端工程 | Frontend | `client/*` | `cd client && rtk npm run build` | - |
| F0102 | 定义前端领域类型 | Frontend | `client/src/types/domain.ts` | `cd client && rtk npm run build` | F0101 |
| F0103 | 准备前端 Mock 数据 | Frontend | `client/src/data/mockData.ts` | `cd client && rtk npm run build` | F0102 |
| F0104 | 实现基础布局组件 | Frontend | `client/src/components/*`, `client/src/App.tsx` | Playwright 首屏检查 | F0103 |
| F0105 | 实现热点雷达页面 | Frontend | `client/src/components/*`, `client/src/App.tsx` | Playwright 搜索和筛选检查 | F0104 |
| F0106 | 实现监控词页面 | Frontend | `client/src/components/*`, `client/src/App.tsx` | Playwright 监控词添加和开关检查 | F0104 |
| F0107 | 实现搜索页面 | Frontend | `client/src/components/*`, `client/src/App.tsx` | Playwright 搜索页检查 | F0105 |
| F0108 | 实现立即扫描 Mock 行为 | Frontend | `client/src/App.tsx` | Playwright 点击扫描检查 | F0105 |
| F0109 | 前端响应式与浏览器验证 | Frontend | `client/src/styles.css` | Playwright 390px/768px/1440px 截图 | F0104-F0108 |
| F0201 | 创建后端工程 | Backend | `server/*` | `cd server && rtk npm run build` | - |
| F0202 | 定义后端领域模型 | Backend | `server/src/domain/types.ts` | `cd server && rtk npm run build` | F0201 |
| F0203 | 初始化 SQLite | Backend | `server/src/db/*` | 服务启动后检查数据表 | F0202 |
| F0204 | 实现热点接口 | Backend | `server/src/routes/hotItems.ts` | `rtk curl http://127.0.0.1:3000/api/hot-items` | F0203 |
| F0205 | 实现监控词接口 | Backend | `server/src/routes/keywords.ts` | `rtk curl http://127.0.0.1:3000/api/keywords` | F0203 |
| F0206 | 实现手动扫描接口 | Backend | `server/src/routes/scans.ts`, `server/src/services/scanner.ts` | `rtk curl -X POST http://127.0.0.1:3000/api/scans/run` | F0204-F0205 |
| F0207 | 前端接入后端 API | Integration | `client/src/api/client.ts`, `client/src/App.tsx` | 前端页面展示后端数据 | F0109, F0206 |
| F0301 | 实现来源适配器接口 | Sources | `server/src/sources/types.ts` | `cd server && rtk npm run build` | F0206 |
| F0302 | 接入 RSS 来源 | Sources | `server/src/sources/rss.ts` | 扫描后 RSS 热点入库 | F0301 |
| F0303 | 接入 GitHub 来源 | Sources | `server/src/sources/github.ts` | 扫描后 GitHub 热点入库 | F0301 |
| F0304 | 实现评分逻辑 | Sources | `server/src/services/scoring.ts` | 热点记录包含评分字段 | F0302-F0303 |
| F0305 | 实现通知事件 | Notifications | `server/src/services/notifications.ts`, `server/src/routes/notifications.ts` | `rtk curl http://127.0.0.1:3000/api/notifications` | F0304 |
| F0306 | 前端通知中心 | Notifications | `client/src/components/NotificationPanel.tsx`, `client/src/components/Topbar.tsx` | Playwright 通知列表检查 | F0207, F0305 |

## 7. Executable Batches

| Batch | Feature Units | Owner | Verify Gate |
| --- | --- | --- | --- |
| B01 | F0101, F0201 | frontend, backend | client build + server build |
| B02 | F0102, F0202 | frontend, backend | shared type parity checked |
| B03 | F0103, F0203 | frontend, backend | mock data renders + SQLite tables exist |
| B04 | F0104, F0204, F0205 | frontend, backend | first screen + hot items API + keywords API |
| B05 | F0105, F0106, F0206 | frontend, backend | filters + keyword CRUD + scan API |
| B06 | F0107, F0108, F0109 | frontend | search page + scan click + responsive screenshots |
| B07 | F0207 | integrator | UI reads API data |
| B08 | F0301, F0302, F0303 | integrator | scanner accepts source adapters |
| B09 | F0304, F0305 | integrator, backend | score and notification APIs return persisted data |
| B10 | F0306 | frontend | notification panel E2E passes |

每个批次固定流程：

```text
explorer -> frontend/backend/integrator -> spec_reviewer -> code_reviewer -> tester -> release gate
```

完成门禁：

- 每个 Feature Unit 必须执行本计划 `Verify` 列声明的最小验证。
- tester 必须记录验证命令、真实输出、退出码和 PASS/FAIL 结论。
- 只有退出码为 0 且输出符合验收目标时，Feature Unit 才能进入 `docs/done_plan.md`。
- 禁止伪造验证通过；未运行命令、命令失败、输出缺失、只凭推断都不能记为完成。
- 失败的 Feature Unit 保留在 `docs/doing_plan.md`，状态为 `Blocked` 或继续修复。

## 8. Step Detail

### B01 Engineering Skeleton

1. F0101 创建 Vite React TypeScript 工程，配置 build/dev 脚本。
2. F0201 创建 Fastify TypeScript 工程，提供 `/health`。
3. tester 分别运行 `cd client && rtk npm run build`、`cd server && rtk npm run build`。

### B02 Domain Model

1. F0102 定义前端 `HotItem`、`MonitorKeyword`、`NotificationEvent`。
2. F0202 定义后端同名领域模型。
3. spec_reviewer 检查前后端字段一致。

### B03 Local Data

1. F0103 准备前端 Mock 热点、关键词、通知。
2. F0203 初始化 SQLite schema 和连接封装。
3. tester 检查构建和数据表创建。

### B04 First Usable Surface

1. F0104 实现 Topbar、Tabs、Layout、基础列表容器。
2. F0204 实现热点列表和详情接口。
3. F0205 实现监控词列表、新增、开关。
4. tester 运行首屏 Playwright 和 API curl。

### B05 Main Actions

1. F0105 实现热点搜索、筛选、排序展示。
2. F0106 实现监控词新增、启停、计数展示。
3. F0206 实现手动扫描接口，先使用本地 Mock source。
4. tester 验证 UI 动作和 scan API。

### B06 Frontend Completion

1. F0107 实现搜索页。
2. F0108 实现立即扫描按钮状态。
3. F0109 完成 390px、768px、1440px 响应式。
4. tester 保存 Playwright 截图证据。

### B07 API Integration

1. F0207 新增前端 API client。
2. 将热点、关键词、扫描动作从 Mock 切到 API。
3. 保留失败态和空态。
4. tester 验证 UI 展示后端数据。

### B08 Sources

1. F0301 定义 SourceAdapter 接口。
2. F0302 接入 RSS source。
3. F0303 接入 GitHub source。
4. tester 验证扫描后数据入库。

### B09 Scoring And Notifications

1. F0304 实现热度分和相关度分。
2. F0305 根据关键词命中生成通知事件。
3. tester 验证热点包含评分、通知 API 返回数据。

### B10 Notification UI

1. F0306 实现通知入口、列表、已读状态。
2. 前端接入通知 API。
3. tester 运行通知列表 Playwright 检查。

## 9. Data Types

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

export type MonitorKeyword = {
  id: string
  text: string
  active: boolean
  hitCount: number
  createdAt: string
}

export type NotificationEvent = {
  id: string
  hotItemId: string
  title: string
  reason: string
  read: boolean
  createdAt: string
}
```

## 10. API Index

| Method | Path | Feature |
| --- | --- | --- |
| GET | `/health` | F0201 |
| GET | `/api/hot-items` | F0204 |
| GET | `/api/hot-items/:id` | F0204 |
| GET | `/api/keywords` | F0205 |
| POST | `/api/keywords` | F0205 |
| PATCH | `/api/keywords/:id` | F0205 |
| POST | `/api/scans/run` | F0206 |
| GET | `/api/notifications` | F0305 |
| PATCH | `/api/notifications/:id/read` | F0305 |

## 11. Test Plan

当前未检测到测试框架。F0101 和 F0201 必须分别建立最小测试或验证脚本入口。

```text
CODE PATH COVERAGE
==================
[GAP] client bootstrap
  ├── build success
  ├── first screen render
  └── responsive layout

[GAP] server bootstrap
  ├── /health success
  ├── route error handling
  └── invalid route fallback

[GAP] SQLite persistence
  ├── schema create
  ├── insert hot item
  ├── update keyword
  └── read notifications

[GAP] scanner pipeline
  ├── source fetch success
  ├── source fetch failure
  ├── scoring
  └── notification generation

USER FLOW COVERAGE
==================
[GAP] [E2E] open dashboard -> filter hot items -> inspect item
[GAP] [E2E] add keyword -> toggle keyword -> run scan -> see hit count
[GAP] [E2E] run scan -> see new scored item -> see notification
[GAP] [E2E] open notifications -> mark as read

COVERAGE: 0/18 paths tested
```

Mandatory verification by layer:

| Layer | Required Checks |
| --- | --- |
| Frontend | build, first screen, search/filter, keyword interaction, scan click, responsive screenshots |
| Backend | build, health, hot-items API, keywords API, scan API, notifications API |
| Storage | schema creation, insert, update, read |
| Sources | mock success, RSS success/failure, GitHub success/failure |
| Integration | UI loads API data, visible error state on API failure |

## 12. Failure Modes

| Flow | Failure | Required Handling |
| --- | --- | --- |
| API client | server down | UI shows recoverable error and retry path |
| SQLite init | db file missing or locked | server returns clear startup failure |
| RSS source | invalid feed XML | scan continues with source error recorded |
| GitHub source | rate limit or network error | scan returns partial result and source error |
| scoring | missing publishedAt or tags | default score path, no crash |
| notifications | hot item missing after scan | skip invalid event and log reason |
| responsive UI | narrow screen overflow | no horizontal scroll at 390px |

## 13. Worktree Parallelization Strategy

| Step | Modules Touched | Depends On |
| --- | --- | --- |
| Frontend skeleton and UI | `client/` | - |
| Backend skeleton and APIs | `server/` | - |
| SQLite and scanner | `server/` | backend skeleton |
| API integration | `client/`, `server/` | frontend completion, backend APIs |
| Sources and scoring | `server/` | scanner |
| Notifications UI | `client/`, `server/` | API integration, notifications API |

Parallel lanes:

```text
Lane A: B01 frontend -> B02 frontend -> B03 frontend -> B04-B06 frontend
Lane B: B01 backend -> B02 backend -> B03-B05 backend
Lane C: B07 integration waits for Lane A + Lane B
Lane D: B08-B09 sources waits for scanner
Lane E: B10 notification UI waits for B07 + B09
```

Execution order:

```text
Run Lane A and Lane B in parallel.
Merge both after B05/B06 verification.
Run Lane C.
Run Lane D.
Run Lane E.
```

Conflict flags:

- Lane C touches `client/` and `server/`; do not run it while Lane A or Lane B is editing the same files.
- Lane D and Lane B both touch `server/`; run sequentially after scanner APIs are stable.

## 14. Not In Scope

| Item | State | Rationale |
| --- | --- | --- |
| 登录权限 | Deferred | 第一版无用户数据隔离需求 |
| 多用户 | Deferred | 单机工具先验证核心价值 |
| Docker 部署 | Deferred | 本地运行先完成 |
| Redis | Deferred | SQLite 足够支持第一版 |
| 消息队列 | Deferred | 手动扫描和同步任务先闭环 |
| PostgreSQL | Deferred | 第一版避免数据库运维复杂度 |
| WebSocket 实时推送 | Deferred | 通知列表轮询足够 |
| 移动 App | Deferred | Web 端先闭环 |
| 小程序 | Deferred | Web 端先闭环 |
| Figma | Deferred | 复用静态原型 |
| 复杂权限系统 | Deferred | 第一版无登录 |
| AI 自动总结长文 | Deferred | 先做热点聚合和评分 |
| CI/CD | Deferred | 当前目标是本地可运行和可验证 |
| 生产部署 | Deferred | 交付前由 release agent 判断 |

## 15. Review Decisions

| Issue | Decision |
| --- | --- |
| 已删除文档仍在 Current Assets | 修正为真实存在资产 |
| 测试框架不存在 | 在 F0101/F0201 建立最小验证入口 |
| 计划只有功能表，缺少执行序 | 增加 B01-B10 批次 |
| 前后端并行冲突 | 按 Lane A/B/C/D/E 执行 |
| QA 命名与 explorer 职责混淆 | 由 `.codex/agents/explorer.toml` 和 `tester.toml` 拆分 |

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
| --- | --- | --- | --- | --- | --- |
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | - | - |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | - | - |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 2 | clean | Plan split into 10 executable batches, 18 test gaps captured |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | - | UI design review still pending |

**UNRESOLVED:** 0
**VERDICT:** ENG REVIEW CLEARED — ready to implement from B01.
