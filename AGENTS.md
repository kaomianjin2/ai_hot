# AI Hot Radar Agent Rules

## 1. 结论

进入本项目后，必须先读取项目级规则、开发计划文档和实时进度文档，再选择待做粒度任务开发。

`AGENTS.md` 是项目前置规则的统一维护入口；其他项目级前置规则都维护在本文件内。

## 2. 必读顺序

每次进入项目后，必须按顺序读取：

1. `AGENTS.md`
2. `docs/development-plan.md`
3. `docs/progress.md`

读取后必须明确：

- 所有要做的 Feature Unit
- 已完成的 Feature Unit
- 正在进行的 Feature Unit
- 待做的 Feature Unit
- 当前任务的影响范围
- 当前任务的验证方式

禁止在未完成以上读取和确认前直接开发。

## 3. 开发前置门禁

开发任何功能前必须满足：

- 已读取 `AGENTS.md`
- 已读取 `docs/development-plan.md`
- 已读取 `docs/progress.md`
- 已从 `Todo` 状态的 Feature Unit 中选择当前任务
- 已把当前 Feature Unit 状态更新为 `In Progress`
- 已填写影响范围
- 已填写验证方式

## 4. 开发完成门禁

完成任何功能前必须满足：

- 已运行最小必要验证
- 已把验证命令写入 `docs/progress.md`
- 已把验证结果写入 `docs/progress.md`
- 已填写副作用
- 已填写是否影响已有调用方
- 状态已更新为 `Done` 或 `Blocked`

## 5. Bug 修复门禁

Bug 修复必须按顺序执行：

1. 记录复现方式
2. 定位原因
3. 记录修复范围
4. 实施修复
5. 运行验证
6. 写回 `docs/progress.md`

## 6. 进度文档记录范围

`docs/progress.md` 只记录业务开发相关内容：

- 产品功能开发
- UI/交互开发
- 后端接口开发
- 数据采集、评分、通知能力开发
- 影响用户可见行为的 Bug 修复
- 项目开发计划中的 Feature Unit

与业务开发无关的维护操作不写入 `docs/progress.md`：

- Git 仓库绑定
- `.gitignore` 维护
- 临时文件清理
- 规则文档整理
- 工具缓存清理
- 本地环境检查

## 7. 命令规则

所有 shell 命令必须使用 `rtk` 前缀。

示例：

```bash
rtk rg --files
rtk npm run build
rtk proxy test -f docs/progress.md
```

## 8. 修改边界

未经明确允许，禁止执行以下操作：

- 安装或升级依赖
- 修改 `.env`、`.gitignore`、密钥、证书、生产配置
- 修改数据库结构、接口定义、部署流程
- 删除文件
- 执行大规模重构

## 9. 文档优先级

规则优先级：

1. 用户当前指令
2. `AGENTS.md`
3. `docs/progress.md`
4. `docs/development-plan.md`
5. 其他项目文档

当文档之间存在冲突时，按以上优先级执行，并在 `docs/progress.md` 记录冲突与处理结果。
