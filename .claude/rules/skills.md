# Skills 角色矩阵

各 subagent 可用的 skill 集中在此处维护，agent 文件不再单独列举。

## 矩阵

| Skill | planner | ui-designer | frontend | backend | integrator | explorer | reviewer | tester |
|---|---|---|---|---|---|---|---|---|
| brainstorming | ✓ | | | | | | | |
| office-hours | ✓ | | | | | | | |
| frontend-design | | ✓ | ✓ | | | | | |
| investigate | | | ✓ | ✓ | ✓ | ✓ | ✓ | |
| browse | | | ✓ | | ✓ | ✓ | | ✓ |
| benchmark | | | | | | | | ✓ |

## 通用禁令

所有 subagent 不得使用以下 skill（由主 agent 评估后调度）：

- ship、land-and-deploy、setup-deploy
- document-release、canary
- qa、qa-only
- finishing-a-development-branch
- Figma 相关

## 例外申请

如某任务需要使用矩阵外 skill，subagent 必须先停下并向主 agent 报告，由主 agent 判定是否放行。
