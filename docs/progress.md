# AI Hot Radar Progress

## 1. 结论

本文件用于实时记录 AI Hot Radar 开发进度；项目前置规则与执行门禁统一维护在 `AGENTS.md`。

## 2. Status Legend

| Status      | 含义       |
| ----------- | -------- |
| Todo        | 未开始      |
| In Progress | 开发中      |
| In Review   | 已实现，等待验证 |
| Blocked     | 阻塞       |
| Done        | 已验证完成    |

## 3. Current Focus

| Field        | Value        |
| ------------ | ------------ |
| Feature Unit | F0101 创建前端工程 |
| Status       | Todo         |
| Started At   | -            |
| Updated At   | 2026-04-18   |
| Owner        | Codex        |

## 4. Feature Units

| ID    | Feature Unit   | Status | Scope                                                                             | Verify                                                              | Result                    | Side Effects                                               |
| ----- | -------------- | ------ | --------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------- |
| F0001 | 创建总开发计划文档      | Done   | `docs/development-plan.md`                                                        | `rtk test -f docs/development-plan.md`                              | 文档已创建                     | 无                                                          |
| F0002 | 创建实时进度文档       | Done   | `docs/progress.md`                                                                | `rtk test -f docs/progress.md`                                      | 文档已创建                     | 无                                                          |
| F0003 | 登记当前 UI 原型状态   | Done   | `docs/progress.md`                                                                | `rtk rg "design/ai-hot-radar.html" docs/progress.md`                | 当前 UI 原型和截图证据已登记          | 无                                                          |
| F0101 | 创建前端工程         | Todo   | `client/*`                                                                        | `cd client && rtk npm run build`                                    | -                         | 新增前端工程目录                                                   |
| F0102 | 定义前端领域类型       | Todo   | `client/src/types/domain.ts`                                                      | `cd client && rtk npm run build`                                    | -                         | 影响前端数据字段约束                                                 |
| F0103 | 准备前端 Mock 数据   | Todo   | `client/src/data/mockData.ts`                                                     | `cd client && rtk npm run build`                                    | -                         | 仅影响前端 mock 数据                                              |
| F0104 | 实现基础布局组件       | Todo   | `client/src/components/*`, `client/src/App.tsx`                                   | Playwright 首屏检查                                                     | -                         | 影响前端首屏布局                                                   |
| F0105 | 实现热点雷达页面       | Todo   | `client/src/components/*`, `client/src/App.tsx`                                   | Playwright 搜索和筛选检查                                                  | -                         | 影响热点列表交互                                                   |
| F0106 | 实现监控词页面        | Todo   | `client/src/components/*`, `client/src/App.tsx`                                   | Playwright 监控词添加和开关检查                                               | -                         | 影响监控词交互                                                    |
| F0107 | 实现搜索页面         | Todo   | `client/src/components/*`, `client/src/App.tsx`                                   | Playwright 搜索页检查                                                    | -                         | 影响搜索结果展示                                                   |
| F0108 | 实现立即扫描 Mock 行为 | Todo   | `client/src/App.tsx`                                                              | Playwright 点击扫描检查                                                   | -                         | 影响热点统计和列表                                                  |
| F0109 | 前端响应式与浏览器验证    | Todo   | `client/src/styles.css`                                                           | Playwright 390px/768px/1440px 截图                                    | -                         | 影响前端样式                                                     |
| F0201 | 创建后端工程         | Todo   | `server/*`                                                                        | `cd server && rtk npm run build`                                    | -                         | 新增后端工程目录                                                   |
| F0202 | 定义后端领域模型       | Todo   | `server/src/domain/types.ts`                                                      | `cd server && rtk npm run build`                                    | -                         | 影响后端数据结构                                                   |
| F0203 | 初始化 SQLite     | Todo   | `server/src/db/*`                                                                 | 服务启动后检查数据表                                                          | -                         | 新增本地数据库文件                                                  |
| F0204 | 实现热点接口         | Todo   | `server/src/routes/hotItems.ts`                                                   | `rtk curl http://127.0.0.1:3000/api/hot-items`                      | -                         | 新增热点查询 API                                                 |
| F0205 | 实现监控词接口        | Todo   | `server/src/routes/keywords.ts`                                                   | `rtk curl http://127.0.0.1:3000/api/keywords`                       | -                         | 新增监控词 API                                                  |
| F0206 | 实现手动扫描接口       | Todo   | `server/src/routes/scans.ts`, `server/src/services/scanner.ts`                    | `rtk curl -X POST http://127.0.0.1:3000/api/scans/run`              | -                         | 新增扫描 API                                                   |
| F0207 | 前端接入后端 API     | Todo   | `client/src/api/client.ts`, `client/src/App.tsx`                                  | 前端页面展示后端数据                                                          | -                         | 前端数据来源从 mock 切换到 API                                       |
| F0301 | 实现来源适配器接口      | Todo   | `server/src/sources/types.ts`                                                     | `cd server && rtk npm run build`                                    | -                         | 影响采集来源扩展                                                   |
| F0302 | 接入 RSS 来源      | Todo   | `server/src/sources/rss.ts`                                                       | 扫描后 RSS 热点入库                                                        | -                         | 新增网络采集                                                     |
| F0303 | 接入 GitHub 来源   | Todo   | `server/src/sources/github.ts`                                                    | 扫描后 GitHub 热点入库                                                     | -                         | 新增网络采集                                                     |
| F0304 | 实现评分逻辑         | Todo   | `server/src/services/scoring.ts`                                                  | 热点记录包含评分字段                                                          | -                         | 影响热点排序                                                     |
| F0305 | 实现通知事件         | Todo   | `server/src/services/notifications.ts`, `server/src/routes/notifications.ts`      | 高分热点生成通知                                                            | -                         | 新增通知数据                                                     |
| F0306 | 前端通知中心         | Todo   | `client/src/components/NotificationPanel.tsx`, `client/src/components/Topbar.tsx` | Playwright 通知列表检查                                                   | -                         | 影响顶部通知入口                                                   |

## 5. Completed History

| ID    | Item         | Status | Evidence                                                                                                                                                | Notes          |
| ----- | ------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| H0001 | 静态 UI 原型     | Done   | `design/ai-hot-radar.html`                                                                                                                              | 已包含热点雷达、监控词、搜索 |
| H0002 | 参考图截图        | Done   | `output/playwright/reference-1.png`, `output/playwright/reference-2.png`, `output/playwright/reference-3.png`                                           | 用于 UI 风格参考     |
| H0003 | 本地 UI 交互验证截图 | Done   | `output/playwright/ai-hot-radar-interactive.png`, `output/playwright/ai-hot-radar-search-fixed.png`, `output/playwright/ai-hot-radar-monitor-fixed.png` | 搜索、筛选、监控词交互已验证 |

## 6. Bug Fix Log

| ID    | Bug            | Repro      | Cause        | Fix           | Verify                      | Status |
| ----- | -------------- | ---------- | ------------ | ------------- | --------------------------- | ------ |
| B0001 | 热点筛选按钮点击无反应    | 点击热点页筛选按钮  | 筛选面板交互未绑定完整  | 补齐筛选按钮事件      | Playwright 点击后面板展开          | Done   |
| B0002 | 搜索页搜索和筛选缺失     | 点击搜索页筛选和搜索 | 搜索页未补齐同款筛选交互 | 补齐搜索页筛选、搜索、重置 | Playwright 搜索 `GitHub` 返回结果 | Done   |
| B0003 | 监控词输入框上方存在多余文案 | 打开监控词页面    | 静态占位标题未移除    | 删除多余标题并优化开关样式 | Playwright 检查冗余文案不存在        | Done   |

## 7. Progress Update Template

开发前复制以下模板新增记录：

```markdown
## Progress Update: <Feature Unit ID>

- Feature Unit:
- Status:
- Started At:
- Updated At:
- Scope:
- Existing Code Read:
- Impacted Files:
- Impacted Functions:
- Verification Command:
- Verification Result:
- Side Effects:
- Existing Callers Impact:
- Notes:
```

## 8. Bug Fix Template

修复 Bug 前复制以下模板新增记录：

```markdown
## Bug Fix: <Bug ID>

- Bug:
- Repro:
- Cause:
- Fix:
- Scope:
- Verification Command:
- Verification Result:
- Side Effects:
- Existing Callers Impact:
- Status:
```

## 9. Rule Reference

执行门禁、进入项目必读顺序、命令规则、修改边界统一维护在 `AGENTS.md`。

`docs/progress.md` 只记录业务开发相关进度；Git、忽略文件、临时清理、规则整理等非业务维护操作不写入本文件。

本文件只维护：

- Feature Unit 状态
- 当前开发焦点
- 已完成历史
- Bug 修复记录
- 进度更新模板
- 验证命令索引

## 10. Verification Commands

前端：

```bash
cd client
rtk npm run build
```

后端：

```bash
cd server
rtk npm run build
```

本地静态验证：

```bash
rtk python3 -m http.server 4173
rtk /Users/zhaosnow/.codex/skills/playwright/scripts/playwright_cli.sh open http://127.0.0.1:4173/design/ai-hot-radar.html
```

接口验证：

```bash
rtk curl http://127.0.0.1:3000/health
rtk curl http://127.0.0.1:3000/api/hot-items
rtk curl http://127.0.0.1:3000/api/keywords
rtk curl -X POST http://127.0.0.1:3000/api/scans/run
```
