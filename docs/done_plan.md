# Done Plan
Task Count: 4

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
