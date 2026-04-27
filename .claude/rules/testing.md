---
paths:
  - "client/**"
  - "server/**"
---

# Testing Rules

## 成功标准

- 修改前必须定义成功标准
- 功能开发必须验证输入、输出、至少 1 个边界情况
- Bug 修复必须按顺序提供复现方式、定位原因、修复、验证

## 完成门禁

- 每个 Feature Unit 必须执行当前任务中 Verify 声明的最小验证
- tester PASS 即视为完成，主 agent 可直接迁 done
- 禁止伪造验证通过：未运行命令、命令失败、输出缺失、只凭推断都不能记为通过

## 记录要求

完成记录必须包含：Feature Unit ID、Owner、Channel（Light/Heavy）、Write Scope、验证命令、真实输出（压缩到最多 2 行）、退出码、PASS / FAIL / BLOCKED 结论、副作用、已有调用方影响

## 失败处理

验证失败时，必须输出阻塞原因、真实命令、真实输出和退出码

## 最小验证

- Frontend：build、Playwright 关键交互、响应式截图
- Backend：build、health、API curl
- Storage：schema 创建、insert、update、read
- Integration：UI 读取 API 数据、API 失败态可见

## 视觉改动判定

### 必须跑 Playwright（关键交互 + 至少 1 个响应式视口）

- 修改 `client/src/components/**`、`client/src/pages/**`、`client/src/styles.css`
- 修改 JSX 结构、CSS class、布局、颜色、间距、动画
- 任何 ui-designer 输出落地的实现

### 不强制 Playwright（build + 单元/类型检查即可）

- 仅修改 `client/src/types/**`、`client/src/utils/**` 中的纯函数
- 仅修改常量、文案、注释
- 仅修改未在视图中渲染的逻辑

## 交付回复

- 最终回复必须包含改动内容、验证命令、验证结果、退出码
- 必须说明副作用和已有调用方影响
- 验证失败时不得标记完成，保留阻塞原因和真实输出
