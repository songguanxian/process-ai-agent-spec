# Prototype Notes

问题：能否用一个本地可运行 Demo，把 PRD/V2 规格中的 Web/App AI 助手、10 个用户故事，以及最新补充的人在回路与人工兜底闭环演示清楚。

实现选择：

- 使用原生 HTML/CSS/JS，避免依赖安装和网络不稳定影响。
- 运行时只使用内存状态和 mock 数据。
- 采用 `?variant=A/B/C` 提供三种原型结构：综合工作台、现场移动优先、治理审计视角。
- 人工兜底不是错误页，而是可继续办理的任务卡和处理页，覆盖 `manual_required`、`waiting_manual_confirm`、`waiting_manual_fill`、`waiting_manual_bind`、`manual_processing`、`manual_completed`、`manual_voided`。

后续如果要转正式代码，需要删除原型切换器，并按正式前端技术栈重写组件、状态管理、接口 mock 和测试。
