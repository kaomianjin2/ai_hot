# Done Plan
Task Count: 17

## Rules

- 开始或完成任务前必须读取本文件顶部 `Task Count`。
- 只有真实验证通过的任务才能追加到本文件。
- 批次任务完成后，将本文件 `Task Count` 按完成数量递增。
- 每条完成记录必须包含验证命令、真实输出、退出码、验证结果、副作用、已有调用方影响。
- 每条完成记录必须保留原任务 ID、Owner、Write Scope。
- 禁止伪造验证通过；未运行命令、命令失败、输出缺失、只凭推断都不能写入本文件。
- 本文件任务数 + `docs/todo_plan.md` 任务数 + `docs/doing_plan.md` 任务数在任务前后必须不变。

## Plans

### F0101 创建前端工程

- Phase: Frontend
- Scope: `client/*`
- Verify: `cd client && rtk npm run build`
- Depends On: -
- Owner: frontend
- Write Scope: `client/*`
- State: Done
- Verification Command: `cd client && rtk npm run build`
- Verification Output:

```text
/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
> tsc -b tsconfig.json tsconfig.node.json && vite build
vite v8.0.9 building client environment for production...
transforming...✓ 16 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.40 kB │ gzip:  0.27 kB
dist/assets/index-CRUgErtd.css    1.00 kB │ gzip:  0.54 kB
dist/assets/index-Dmpvkhtt.js   191.29 kB │ gzip: 60.51 kB
✓ built in 90ms
```

- Exit Code: 0
- Result: PASS
- User Review: PASS
- User Review Source: 用户回复“通过”
- Side Effects: `rtk npm install` 在已移除的 `./worktrees/F0101` 中生成过 `client/node_modules/`；`rtk npm run build` 生成过 `client/dist/`；两者均被根 `.gitignore` 忽略，未进入提交。已按规则移除 `./worktrees/F0101` 并执行 `rtk git worktree prune`。
- Existing Caller Impact: F0101 前不存在已跟踪 `client/` 前端工程；本次新增 React + Vite + TypeScript + CSS 工程骨架，不影响后端、API、数据库结构或部署流程。F0102 可继续新增 `client/src/types/domain.ts`，F0104 可继续改造 `client/src/App.tsx` 并新增 `client/src/components/*`。
- Subagent Flow: frontend implementation DONE; spec reviewer PASS; code reviewer PASS; tester PASS; user review PASS.

### F0102 定义前端领域类型

- Phase: Frontend
- Scope: `client/src/types/domain.ts`
- Verify: `cd client && rtk npm run build`
- Depends On: F0101
- Owner: frontend
- Write Scope: `client/src/types/domain.ts`
- State: Done
- Verification Command: `cd client && rtk npm run build`
- Verification Output:

```text
> tsc -b tsconfig.json tsconfig.node.json && vite build
vite v8.0.9 building client environment for production...
transforming...✓ 16 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.40 kB │ gzip:  0.27 kB
dist/assets/index-CRUgErtd.css    1.00 kB │ gzip:  0.54 kB
dist/assets/index-Dmpvkhtt.js   191.29 kB │ gzip: 60.51 kB
✓ built in 70ms
```

- Exit Code: 0
- Result: PASS
- User Review: PASS
- User Review Source: 用户回复“通过”
- Side Effects: `rtk npm install` 在 `./worktrees/F0102/client` 中生成 `node_modules/`；`rtk npm run build` 生成 `client/dist/` 和 TypeScript build info；这些产物均被 `.gitignore` 忽略，未进入提交。任务合并后将按规则移除 `./worktrees/F0102` 并执行 `rtk git worktree prune`。
- Existing Caller Impact: 新增 `client/src/types/domain.ts`，仅包含 TypeScript 类型导出，无运行时代码；当前没有现有文件导入该文件，不改变页面行为、接口、数据库结构或部署流程。F0103 可基于 `HotItem`、`MonitorKeyword`、`NotificationEvent`、`ScanSummary`、`HotItemFilters` 编写 mock 数据。
- Subagent Flow: frontend implementation PASS; tester PASS; user review PASS.

### F0103 准备前端 Mock 数据

- Phase: Frontend
- Scope: `client/src/data/mockData.ts`
- Verify: `cd client && rtk npm run build`
- Depends On: F0102
- Owner: frontend
- Write Scope: `client/src/data/mockData.ts`
- State: Done
- Verification Command: `cd client && rtk npm run build`
- Verification Output:

```text
/opt/homebrew/Library/Homebrew/cmd/shellenv.sh: line 18: /bin/ps: Operation not permitted
> tsc -b tsconfig.json tsconfig.node.json && vite build
vite v8.0.9 building client environment for production...
transforming...✓ 16 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.40 kB │ gzip:  0.27 kB
dist/assets/index-CRUgErtd.css    1.00 kB │ gzip:  0.54 kB
dist/assets/index-Dmpvkhtt.js   191.29 kB │ gzip: 60.51 kB
✓ built in 252ms
```

- Exit Code: 0
- Result: PASS
- User Review: PASS
- User Review Source: 用户回复“通过”
- Side Effects: `rtk npm install` 在 `./worktrees/F0103/client` 中生成 `node_modules/`；`rtk npm run build` 生成 `client/dist/` 和 TypeScript build info；这些产物均被 `.gitignore` 忽略，未进入提交。任务合并后将按规则移除 `./worktrees/F0103` 并执行 `rtk git worktree prune`。
- Existing Caller Impact: 新增 `client/src/data/mockData.ts`，仅导出前端 Mock 数据和默认筛选值；当前没有现有文件导入该文件，不改变页面行为、API、数据库结构或部署流程。F0104-F0108 可继续基于 `mockHotItems`、`mockMonitorKeywords`、`mockNotificationEvents`、`mockScanSummaries` 和 `defaultHotItemFilters` 接入页面与交互。
- Subagent Flow: explorer PASS; frontend implementation PASS; spec reviewer PASS; code reviewer PASS; tester PASS; user review PASS.

### F0104 实现基础布局组件

- Phase: Frontend
- Scope: `client/src/components/*`, `client/src/App.tsx`
- Verify: Playwright 首屏检查
- Depends On: F0103
- Owner: frontend
- Write Scope: `client/src/components/*`, `client/src/App.tsx`
- State: Done
- Verification Command: `cd worktrees/F0104/client && rtk npm install && rtk npm run build`
- Verification Output:

```text
added 27 packages, and audited 28 packages in 776ms
8 packages are looking for funding
found 0 vulnerabilities

> ai-hot-client@0.1.0 build
> tsc -b tsconfig.json tsconfig.node.json && vite build
vite v8.0.9 building client environment for production...
transforming...✓ 22 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.40 kB │ gzip:  0.27 kB
dist/assets/index-BdLLK1zT.css    4.13 kB │ gzip:  1.30 kB
dist/assets/index-CyKYq4wj.js   197.02 kB │ gzip: 62.50 kB
✓ built in 265ms
```

- Browser Verification: Playwright opened `http://127.0.0.1:4173/`; verified `AI Hot Radar`, `热点`, `监控词`, `通知`, `热点雷达`, and one hot item title visible. Desktop `1440x900` and mobile `390x844` both reported `hasHorizontalOverflow: false`; `inputCount: 0`; `buttonTexts: []`. Console had one `favicon.ico` 404 resource error and no React/runtime error.
- Screenshot Evidence: `/tmp/F0104-desktop.png`, `/tmp/F0104-mobile.png`
- Exit Code: 0
- Result: PASS
- User Review: PASS
- User Review Source: 用户回复“通过”
- Side Effects: `rtk npm install` 在 `./worktrees/F0104/client` 中生成 `node_modules/`；`rtk npm run build` 生成 `client/dist/` 和 TypeScript build info；这些产物均被 `.gitignore` 忽略，未进入提交。任务合并后将按规则移除 `./worktrees/F0104` 并执行 `rtk git worktree prune`。
- Existing Caller Impact: `client/src/main.tsx` 仍按原方式渲染 `App`。首页从占位内容变为可复用基础布局，新增 `Topbar`、静态 `Tabs`、`Layout`、`ListContainer`，并使用现有 Mock 数据展示只读摘要；不改变 API、类型、Mock 数据、数据库结构或部署流程。F0105/F0106 可复用这些组件继续接入热点雷达页和监控词页。
- Subagent Flow: explorer PASS; frontend implementation PASS; spec reviewer PASS after browser evidence; code reviewer PASS; tester PASS; user review PASS.

### F0105 实现热点雷达页面

- Phase: Frontend
- Scope: `client/src/components/*`, `client/src/App.tsx`
- Verify: Playwright 搜索和筛选检查
- Depends On: F0104
- Owner: frontend
- Write Scope: `client/src/components/*`, `client/src/App.tsx`
- State: Done
- Verification Command: `cd worktrees/F0105/client && rtk npm install && rtk npm run build`; Playwright: snapshot, search title/source/tag, min heat 80, combined empty state, heat-asc sort, 390x844 overflow check
- Verification Output:

```text
build: `tsc -b tsconfig.json tsconfig.node.json && vite build`; `✓ built in 71ms`
Playwright: search/filter/sort PASS; `390x844` reported `hasHorizontalOverflow=false`
```

- Browser Verification: Playwright verified `热点雷达`, `启用监控词`, and `最近扫描` remained visible; `browser` matched the title `Open-source agent benchmark adds browser task coverage`; `GitHub` matched source; `planning` matched tag; min heat `80` changed results from `3 / 3` to `1 / 3`; combined `GitHub + #planning` showed the empty-state copy; `heat-asc` sorted scores as `18 → 76 → 92`.
- Screenshot Evidence: `.playwright-cli/page-2026-04-26T10-57-26-438Z.png`, `.playwright-cli/page-2026-04-26T10-58-51-543Z.png`
- Exit Code: 0
- Result: PASS
- User Review: PASS
- User Review Source: 用户回复“通过”
- Side Effects: `rtk npm install` 在 `./worktrees/F0105/client` 中生成 `node_modules/`；`rtk npm run build` 生成 `client/dist/` 和 TypeScript build info；Playwright 生成 `.playwright-cli/` 截图文件；这些产物均被 `.gitignore` 忽略，未进入提交。浏览器控制台存在范围外 `favicon.ico` 404，不影响 F0105 验收。
- Existing Caller Impact: `client/src/main.tsx` 仍按原方式渲染 `App`。本次新增 `HotRadarControls` 并在热点雷达页接入搜索、来源筛选、标签筛选、最低热度筛选、排序和空态展示；不改变 API、类型定义、Mock 数据、数据库结构或部署流程。F0106/F0107/F0108 后续仍涉及 `client/src/App.tsx`，必须串行执行。
- Subagent Flow: explorer PASS; frontend implementation PASS after dependency install; spec reviewer PASS after tester evidence; code reviewer PASS; tester PASS; user review PASS.

### F0106 实现监控词页面

- Phase: Frontend
- Scope: `client/src/components/*`, `client/src/App.tsx`
- Verify: Playwright 监控词添加和开关检查
- Depends On: F0104
- Owner: frontend
- Write Scope: `client/src/components/*`, `client/src/App.tsx`
- State: Done
- Verification Command: `cd worktrees/F0106/client && rtk npm install && rtk npm run build`; Playwright: click 监控词 tab, add `  LLM Ops `, duplicate add, empty add, toggle LLM Ops, resize 390x844 and overflow check
- Verification Output:

```text
build: `tsc -b tsconfig.json tsconfig.node.json && vite build`; `✓ built in 344ms`
Playwright: add/duplicate/empty/toggle PASS; `390x844` reported `hasHorizontalOverflow=false`
```

- Browser Verification: Playwright verified initial `3 个监控词 · 2 个启用`; adding `  LLM Ops  ` produced `4 个监控词 · 3 个启用`, `已新增监控词：LLM Ops`, `LLM Ops 已开启`, and tab `监控词 3`; duplicate add showed `监控词已存在，请勿重复添加。`; empty add showed `请输入监控词后再提交。`; toggling `LLM Ops` showed `LLM Ops 已停用`, `4 个监控词 · 2 个启用`, and tab `监控词 2`; `390x844` eval returned `scrollWidth=390`, `clientWidth=390`, `hasHorizontalOverflow=false`, visible input and toggle buttons.
- Screenshot Evidence: `.playwright-cli/page-2026-04-26T12-48-12-339Z.png`
- Exit Code: 0
- Result: PASS
- User Review: PASS
- User Review Source: 用户回复“通过”
- Side Effects: `rtk npm install` 在 `./worktrees/F0106/client` 中生成 `node_modules/`；`rtk npm run build` 生成 `client/dist/` 和 TypeScript build info；Playwright 生成 `.playwright-cli/` 快照和截图文件；这些产物均被 `.gitignore` 忽略，未进入提交。验证期间启动过 Vite dev server，已用 `rtk pkill -f vite` 停止。安装依赖时验证工具短暂向 `.gitignore` 追加过无关 `.gstack/`，已移除该无关改动。
- Existing Caller Impact: `client/src/main.tsx` 仍按原方式渲染 `App`。`Tabs` 从静态展示升级为可访问 tab 控件，当前唯一调用方 `App` 已同步；顶栏仍展示未读通知数。新增 `MonitorKeywordsPanel` 并在监控词页接入新增、trim、重复拦截、空输入拦截、启停和计数同步；不改变 API、类型定义、Mock 数据文件、数据库结构或部署流程。F0107/F0108 后续仍涉及 `client/src/App.tsx`，必须串行执行。
- Subagent Flow: explorer PASS; frontend implementation PASS after review fixes; spec reviewer PASS; code reviewer PASS; tester PASS after dependency install; user review PASS.

### F0107 实现搜索页面

- Phase: Frontend
- Scope: `client/src/components/*`, `client/src/App.tsx`
- Verify: Playwright 搜索页检查
- Depends On: F0105
- Owner: frontend
- Channel: Heavy
- Write Scope: `client/src/components/SearchPage.tsx`, `client/src/components/components.css`, `client/src/App.tsx`
- State: Done
- Verification Command: `cd client && ./node_modules/.bin/tsc -b && ./node_modules/.bin/vite build`; Playwright 搜索页交互
- Verification Output: `✓ built in 400ms`; 搜索 "agent" 返回 1 条匹配结果; 搜索 "zzzznotfound" 显示 empty state
- Exit Code: 0
- Result: PASS
- Side Effects: 新增 `client/src/components/SearchPage.tsx`; `components.css` 新增 `.search-page*` 样式段; 不影响后端、API、数据库或部署
- Existing Caller Impact: `App.tsx` 新增"搜索" tab 和 SearchPage 渲染分支; 热点/监控词/通知三个已有 tab 行为不变
- Subagent Flow: explorer 跳过(服务不可用，主 agent 自行探索); frontend 由主 agent 直接实现; tester 由主 agent 通过 Playwright MCP 验证; PASS

### F0108 实现立即扫描 Mock 行为

- Phase: Frontend
- Scope: `client/src/App.tsx`
- Verify: Playwright 点击扫描检查
- Depends On: F0105
- Owner: frontend
- Channel: Light
- Write Scope: `client/src/App.tsx`
- State: Done
- Verification Command: `cd client && npm run build`; Playwright 点击扫描交互
- Verification Output: `✓ built in 175ms`; 初始 succeeded/12/4 → 点击后 running/0/0（按钮 disabled "扫描中…"）→ 1.5s 后 succeeded/8/3（按钮 enabled "立即扫描"）; 可重复触发
- Exit Code: 0
- Result: PASS
- Side Effects: `scanSummary` 从模块级常量提升为 useState；`mockScanSummaries` 仍被引用为初始值；不影响后端、API、数据库或部署
- Existing Caller Impact: Topbar `actionSlot` 从占位文本变为功能按钮；底部"最近扫描"区块改读 state 且移除 null 分支；热点/搜索/监控词/通知四个 tab 行为不变
- Subagent Flow: frontend implementation PASS; tester 由主 agent 通过 Playwright MCP 验证; PASS

### F0109 前端响应式与浏览器验证

- Phase: Frontend
- Scope: `client/src/styles.css`
- Verify: Playwright 390px/768px/1440px 截图
- Depends On: F0104-F0108
- Owner: frontend
- Channel: Light
- Write Scope: `client/src/styles.css`
- State: Done
- Verification Command: `cd client && npm run build`; Playwright 390x844/768x1024/1440x900 溢出检测
- Verification Output: `✓ built in 87ms`; 三个视口 scrollWidth === clientWidth，hasOverflow=false，body/root overflow-x=hidden
- Exit Code: 0
- Result: PASS
- Side Effects: 移除旧占位样式（`.app-shell`、`.eyebrow`、`h1`、`.summary`、`@media`），为 body 和 #root 添加 `overflow-x: hidden`；不影响后端、API、数据库或部署
- Existing Caller Impact: 所有使用 `styles.css` 的页面（热点/搜索/监控词/通知）行为不变；移除的旧样式已在 F0104 后不再被任何组件引用
- Subagent Flow: frontend implementation PASS; tester Playwright PASS

### F0201 创建后端工程

- Phase: Backend
- Scope: `server/*`
- Verify: `cd server && npm run build`
- Depends On: -
- Owner: backend
- Channel: Heavy
- Write Scope: `server/*`
- State: Done
- Verification Command: `cd server && npm run build`
- Verification Output: `> tsc`（无错误输出）
- Exit Code: 0
- Result: PASS
- Side Effects: 新建 `server/` 目录，包含 `package.json`（fastify 5.4、typescript 6.0、tsx 4.19）、`tsconfig.json`、`src/index.ts`（Fastify server + /health 端点）；`node_modules/` 和 `dist/` 被 `.gitignore` 忽略
- Existing Caller Impact: 新增后端工程骨架，不影响前端、API 契约、数据库结构或部署流程；F0202 可继续在 `server/src/domain/types.ts` 定义领域模型
- Subagent Flow: backend implementation PASS; tester build PASS

### F0202 定义后端领域模型

- Phase: Backend
- Scope: `server/src/domain/types.ts`
- Verify: `cd server && npm run build`
- Depends On: F0201
- Owner: backend
- Channel: Light
- Write Scope: `server/src/domain/types.ts`
- State: Done
- Verification Command: `cd server && npm run build`
- Verification Output: `> tsc`（无错误，编译成功）
- Exit Code: 0
- Result: PASS
- Side Effects: 新建 `server/src/domain/types.ts`，定义 HotItem、MonitorKeyword、NotificationEvent、ScanStatus、ScanSummary 及对应 CreateXxxInput 类型
- Existing Caller Impact: 无，当前 `server/src/index.ts` 未引用此文件，后续模块按需 import
- Subagent Flow: backend implementation PASS; tester build PASS

### F0203 初始化 SQLite

- Phase: Backend
- Scope: `server/src/db/*`
- Verify: 服务启动后检查数据表
- Depends On: F0202
- Owner: backend
- Channel: Heavy
- Write Scope: `server/src/db/*`
- State: Done
- Verification Command: `cd server && npm run build`; `node f0203-verify.mjs`（schema 创建/insert/update/read）; `tsx src/index.ts` + `curl http://127.0.0.1:3000/health`
- Verification Output: `tsc` 无错误; 4 张表创建、insert/update/read 全部 OK; `{"status":"ok"}`
- Exit Code: 0
- Result: PASS
- Side Effects: 新增 `server/src/db/schema.ts`（4 张表 DDL）和 `server/src/db/client.ts`（单例连接 + WAL + mkdirSync）；`server/package.json` 新增 `better-sqlite3` 依赖；运行时生成 `server/data/hot-radar.db`
- Existing Caller Impact: 当前 `server/src/index.ts` 未引用 db 模块，无已有调用方受影响；后续路由层按需 `import { getDb } from './db/client.js'`
- Subagent Flow: explorer PASS; backend implementation PASS; reviewer PASS after fix (WAL 顺序 + mkdirSync); tester PASS

### F0204 实现热点接口

- Phase: Backend
- Scope: `server/src/routes/hotItems.ts`
- Verify: `curl http://127.0.0.1:3000/api/hot-items`
- Depends On: F0203
- Owner: backend
- Channel: Light
- Write Scope: `server/src/routes/hotItems.ts`
- State: Done
- Verification Command: `cd server && npm run build && npx tsx src/index.ts &` then `curl http://127.0.0.1:3000/api/hot-items`
- Verification Output: `tsc` 无错误；`curl` 返回 `[]` HTTP 200
- Exit Code: 0
- Result: PASS
- Side Effects: 新增 `server/src/routes/hotItems.ts`，实现 GET /api/hot-items（支持 source/tag/minHeat 过滤）、GET /api/hot-items/:id、POST /api/hot-items；`server/src/index.ts` 注册该路由插件
- Existing Caller Impact: 新增 API 端点，不影响已有路由、前端、数据库结构或部署流程；F0206 手动扫描可基于 POST /api/hot-items 写入热点
- Subagent Flow: backend implementation PASS; tester PASS

### F0205 实现监控词接口

- Phase: Backend
- Scope: `server/src/routes/keywords.ts`
- Verify: `curl http://127.0.0.1:3000/api/keywords`
- Depends On: F0203
- Owner: backend
- Channel: Light
- Write Scope: `server/src/routes/keywords.ts`
- State: Done
- Verification Command: `cd server && npm run build && npx tsx src/index.ts &` then `curl http://127.0.0.1:3000/api/keywords`
- Verification Output: `tsc` 无错误；`curl` 返回 `[]` HTTP 200
- Exit Code: 0
- Result: PASS
- Side Effects: 新增 `server/src/routes/keywords.ts`，实现 GET/POST/PATCH/:id/DELETE/:id 四个端点；`server/src/index.ts` 注册该路由插件
- Existing Caller Impact: 新增 API 端点，不影响已有路由、前端、数据库结构或部署流程；F0207 前端接入可调用这些接口
- Subagent Flow: backend implementation PASS; tester PASS

### F0206 实现手动扫描接口

- Phase: Backend
- Scope: `server/src/routes/scans.ts`, `server/src/services/scanner.ts`
- Verify: `curl -X POST http://127.0.0.1:3000/api/scans/run`
- Depends On: F0204-F0205
- Owner: backend
- Channel: Light
- Write Scope: `server/src/routes/scans.ts`, `server/src/services/scanner.ts`
- State: Done
- Verification Command: `cd server && npm run build && npx tsx src/index.ts &` then `curl -X POST http://127.0.0.1:3000/api/scans/run`
- Verification Output: `tsc` 无错误；`curl` 返回 201 `{"status":"succeeded","discoveredCount":3,"matchedCount":0}`
- Exit Code: 0
- Result: PASS
- Side Effects: 新增 `server/src/routes/scans.ts`（POST /api/scans/run + GET /api/scans）和 `server/src/services/scanner.ts`（mock 扫描逻辑）；`server/src/index.ts` 注册 scansRoutes 插件；运行时生成 `server/data/hot-radar.db`（已 untrack）
- Existing Caller Impact: 新增 API 端点，不影响已有路由（hotItems、keywords）、前端、数据库结构或部署流程；F0207 前端接入可调用 POST /api/scans/run 触发扫描；F0301 来源适配器可替换 mock 逻辑
- Subagent Flow: backend implementation PASS; tester PASS

### F0207 前端接入后端 API

- Phase: Integration
- Scope: `client/src/api/client.ts`, `client/src/App.tsx`
- Verify: 前端页面展示后端数据
- Depends On: F0109, F0206
- Owner: frontend
- Write Scope: `client/src/api/client.ts`, `client/src/App.tsx`, `client/vite.config.ts`, `client/src/components/MonitorKeywordsPanel.tsx`
- Channel: Heavy
- State: Done
- Verification Command: `cd client && npx tsc --noEmit && npm run build` + `cd server && npm run build` + 后端启动 + vite proxy 代理验证 + Playwright 桌面/移动视口
- Verification Output:

```text
前端 tsc: No errors found, build: 26 modules, 428ms
后端 tsc: PASS
health: {"status":"ok"}
/api/hot-items, /api/keywords, /api/scans: [] (空数组)
vite proxy /api/*: 代理转发正常
Playwright: 页面加载触发 API 请求，无 console error，桌面/移动响应式正常
```

- Exit Code: 0
- Verification Result: PASS
- Side Effects: 前端不再使用 mock 热点/监控词/扫描数据，依赖后端服务运行；mockNotificationEvents 保留
- Existing Caller Impact: MonitorKeywordsPanel.onAddKeyword 类型扩宽为 `boolean | Promise<boolean>`，向后兼容；其余组件 props 签名不变

### F0301 实现来源适配器接口

- Phase: Sources
- Scope: `server/src/sources/types.ts`
- Verify: `cd server && npm run build`
- Depends On: F0206
- Owner: backend
- Channel: Light
- Write Scope: `server/src/sources/types.ts`
- State: Done
- Verification Command: `cd worktrees/F0301/server && npm install && npm run build`
- Verification Output: `> tsc`（无错误）；`dist/sources/types.js` 已生成
- Exit Code: 0
- Result: PASS
- Side Effects: 新增 `server/src/sources/types.ts`，定义 `SourceAdapter` 接口（name + fetch）和 `SourceConfig` 类型（url + enabled）
- Existing Caller Impact: 无。新增文件，当前无调用方；F0302/F0303 将 import 此接口
- Subagent Flow: backend implementation PASS; tester build PASS
