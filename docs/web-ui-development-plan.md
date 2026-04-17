# AI Hot Radar Web UI Development Plan

## 1. 开发范围

本阶段实现 Web 端 UI，基于 `design/ai-hot-radar.html` 设计稿落地 React + Vite + TypeScript 前端。

第一版只使用本地 mock 数据，不接后端 API。

## 2. 技术栈

- React
- Vite
- TypeScript
- CSS
- 本地 mock 数据

不引入 UI 组件库，不安装图标库。

## 3. 目标布局

实现参考 HotPulse 截图的科技风单页控制台。

```text
client/
  src/
    App.tsx
    main.tsx
    styles.css
    data/
      mockData.ts
    types/
      domain.ts
    components/
      Topbar.tsx
      Tabs.tsx
      StatsGrid.tsx
      SearchPanel.tsx
      Toolbar.tsx
      HotCard.tsx
      HotList.tsx
      MonitorKeywordGrid.tsx
      MonitorKeywordCard.tsx
```

## 4. Mock 数据结构

```ts
export type HotSource = 'bilibili' | 'bing' | 'github' | 'hackernews' | 'rss'

export type HotItem = {
  id: number
  source: HotSource
  topic: string
  title: string
  summary: string
  tags: string[]
  heatScore: number
  relevanceScore: number
  reliable: boolean
  createdAtLabel: string
}

export type MonitorKeyword = {
  id: number
  text: string
  active: boolean
  hitCount: number
}

export type StatItem = {
  label: string
  value: number
  tone: 'default' | 'cyan' | 'danger' | 'green'
}
```

## 5. 组件职责

### Topbar

- Logo。
- 产品名。
- 中文副标题。
- 立即扫描按钮。
- 通知按钮和 `9+` 角标。

### Tabs

- `热点雷达`。
- `监控词`。
- `搜索`。
- 当前 tab 高亮。

### StatsGrid

- 展示 4 个统计卡片。
- 卡片内容：总热点、今日新增、紧急热点、监控词。

### SearchPanel

- 复用在热点来源搜索和监控词添加。
- 输入框和主按钮。

### Toolbar

- 排序 chips。
- 筛选按钮。
- 重置按钮。

### HotList

- 渲染热点卡片列表。
- 空状态展示无热点提示。

### HotCard

- 来源、主题、时间。
- 标题。
- 摘要。
- 标签。
- 查看按钮。

### MonitorKeywordGrid

- 两列关键词开关卡片。
- 移动端单列。

## 6. 交互行为

### Tab 切换

第一版可先静态展示全部区块；实现阶段保留 tab 状态，为后续切换做准备。

### 立即扫描

第一版 mock 行为：

1. 点击后按钮进入 scanning 文案。
2. 1.2 秒后新增一条热点到列表顶部。
3. 今日新增和总热点数字加 1。

### 搜索

第一版 mock 行为：

1. 输入关键词。
2. 点击搜索。
3. 前端按标题、摘要、来源过滤热点列表。

### 监控词

第一版 mock 行为：

1. 输入关键词。
2. 点击添加。
3. 新关键词加入 MonitorKeywordGrid。
4. 开关点击后切换 active。

## 7. 响应式规则

- `>= 900px`: 统计卡 4 列，监控词 2 列。
- `< 900px`: 统计卡 2 列，热点卡按钮换行。
- `< 560px`: 统计卡单列，监控词单列，搜索按钮换行。

禁止横向滚动。

## 8. 验证命令

初始化：

```bash
rtk npm create vite@latest client -- --template react-ts
cd client
rtk npm install
```

开发：

```bash
cd client
rtk npm run dev
```

构建：

```bash
cd client
rtk npm run build
```

静态设计稿检查：

```bash
open /Users/zhaosnow/Desktop/projects/AIProject/ai_hot/design/ai-hot-radar.html
```

## 9. 暂不实现内容

- 后端 API。
- 数据库。
- OpenRouter。
- 真实抓取。
- WebSocket。
- 邮件通知。
- 登录权限。
- Figma。
- Docker。

## 10. 验收标准

- React 版与 `design/ai-hot-radar.html` 布局一致。
- 首页首屏为科技风控制台。
- 包含顶部品牌栏、Tab、统计卡、搜索面板、排序筛选、热点卡片、监控词卡片。
- 390px 宽度无横向滚动。
- 构建通过，无 TypeScript 错误。
